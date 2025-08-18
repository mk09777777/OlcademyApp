const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
const sharp = require("sharp");
const { LRUCache } = require("lru-cache");

// Cache 1000 images for fast and scalable retriaval of images
const imageCache = new LRUCache({
    max: 1000, // Store up to 1000 images in cache
    ttl: 1000 * 60 * 60 * 24 * 10 // Cache expires in 10 days (10 day)
});

const connectToMongoDB = require("../config/database.config")
connectToMongoDB();

const mongoURI = `${process.env.MONGO_URL}/Perfume_Shop`

const conn = mongoose.connection;
let gfs;
conn.once("open", () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection("uploads"); // Default bucket
    console.log("Connection is open");
});

// Dynamic Storage for Different Image Types
const storage = (bucketName) =>
    new GridFsStorage({
        url: mongoURI,
        file: (req, file) => ({
            bucketName,
            filename: `${Date.now()}-${file.originalname}`,
            metadata: { type: file.mimetype },
        }),
    });

const upload = (bucketName) => multer({ storage: storage(bucketName) });

// Image compression options
const compressionOptions = {
    jpeg: {
        quality: 70,
        mozjpeg: true,
    },
    png: {
        quality: 70,
        compressionLevel: 9,
    },
    webp: {
        quality: 70,
    }
};

// Function to compress image based on its format
async function compressImage(buffer, format) {
    const sharpInstance = sharp(buffer);

    switch (format.toLowerCase()) {
        case 'jpeg':
        case 'jpg':
            return sharpInstance
                .jpeg(compressionOptions.jpeg)
                .toBuffer();
        case 'png':
            return sharpInstance
                .png(compressionOptions.png)
                .toBuffer();
        case 'webp':
            return sharpInstance
                .webp(compressionOptions.webp)
                .toBuffer();
        default:
            return sharpInstance
                .jpeg(compressionOptions.jpeg)
                .toBuffer();
    }
}

// Universal Image Upload Route
router.post("/upload/:bucket", async (req, res, next) => {
    try {
        const bucketName = req.params.bucket; // Get bucket name dynamically

        // Create multer middleware dynamically
        const uploadMiddleware = upload(bucketName).single("image");


        uploadMiddleware(req, res, async (err) => {
            if (err) return res.status(500).json({ error: err.message });

            if (!req.file) return res.status(400).json({ error: "No file uploaded" });

            const format = req.file.originalname.split('.').pop();

            // Compress image
            const compressedBuffer = await compressImage(req.file.buffer, format);

            // Save compressed image to the correct bucket
            const writeStream = gfs.createWriteStream({
                filename: req.file.filename,
                bucketName,
                metadata: { type: req.file.mimetype },
            });

            writeStream.end(compressedBuffer);
            writeStream.on("finish", () =>
                res.status(201).json({ message: "File uploaded", filename: req.file.filename })
            );
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Multi Image Upload
router.post("/upload-multiple/:bucket", async (req, res) => {
    try {
        const bucketName = req.params.bucket;
        const uploadMiddleware = upload(bucketName).array("images", 20); // Max 20 images

        uploadMiddleware(req, res, async (err) => {
            if (err) return res.status(500).json({ error: err.message });
            if (!req.files || req.files.length === 0) return res.status(400).json({ error: "No files uploaded" });

            const uploadedFiles = [];

            for (let file of req.files) {
                const format = file.originalname.split('.').pop();
                const compressedBuffer = await compressImage(file.buffer, format);

                const writeStream = gfs.createWriteStream({
                    filename: file.filename,
                    bucketName,
                    metadata: { type: file.mimetype },
                });

                writeStream.end(compressedBuffer);
                uploadedFiles.push(file.filename);
            }

            res.status(201).json({ message: "Files uploaded", filenames: uploadedFiles });
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Scalable Get Image Route For Fast And Efficient Image Retrival From Cache
router.get("/image/:bucket/:filename", async (req, res) => {
    try {
        const { bucket, filename } = req.params;

        // Check if the image exists in cache
        if (imageCache.has(filename)) {
            return res.sendFile(imageCache.get(filename)); // Serve cached image
        }

        // Use indexes to speed up queries
        const file = await gfs.collection(bucket).findOne({ filename });
        if (!file) {
            return res.status(404).json({ error: "File not found" });
        }

        // Set response headers for better performance
        res.set("Content-Type", file.contentType);
        res.set("Cache-Control", "public, max-age=3600"); // Cache in browser for 1 hour

        // Stream image data
        const readStream = gfs.createReadStream({ filename, root: bucket });

        readStream.on("error", (error) => {
            console.error("Stream Error:", error);
            res.status(500).json({ error: "Error streaming file" });
        });

        // Store the image in the cache after successful retrieval
        let imageBuffer = Buffer.from([]);
        readStream.on("data", (chunk) => {
            imageBuffer = Buffer.concat([imageBuffer, chunk]);
        });

        readStream.on("end", () => {
            imageCache.set(filename, imageBuffer);
            res.end(imageBuffer);
        });

        readStream.pipe(res);
    } catch (error) {
        console.error("Error fetching image:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Update Image Route - Deletes old image and uploads a new image (Update Image)
router.put("/update/:bucket/:filename", async (req, res) => {
    try {
        const { bucket, filename } = req.params;
        const uploadMiddleware = upload(bucket).single("image");

        // Create multer middleware dynamically
        uploadMiddleware(req, res, async (err) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            if (!req.file) {
                return res.status(400).json({ error: "No file uploaded" });
            }

            // Find the existing file from db
            const file = await gfs.collection(bucket).findOne({ filename });
            if (!file) {
                return res.status(404).json({ error: "File not found" });
            }

            // Delete file metadata/file from the files collection
            await gfs.collection(bucket).deleteOne({ filename });

            // Delete associated chunks from the chunks collection
            await gfs.collection(`${bucket}.chunks`).deleteMany({ files_id: file._id });

            // Compress the new image
            // const compressedBuffer = await sharp(req.file.buffer).resize(800).jpeg({ quality: 70 }).toBuffer();

            const format = req.file.originalname.split('.').pop();

            // Compress the new image
            const compressedBuffer = await compressImage(req.file.buffer, format);

            // Upload new image
            const writeStream = gfs.createWriteStream({
                filename: req.file.filename,
                bucketName: bucket,
                metadata: { type: req.file.mimetype },
            });

            writeStream.end(compressedBuffer);
            writeStream.on("finish", () => res.status(200).json({ message: "File updated successfully" }));
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Delete Image Route - Removes both file metadata and chunks
router.delete("/delete/:bucket/:filename", async (req, res) => {
    try {
        const { bucket, filename } = req.params;

        const file = await gfs.collection(bucket).findOne({ filename });
        if (!file) {
            return res.status(404).json({ error: "File not found" });
        }

        // Delete file metadata from the files collection
        await gfs.collection(bucket).deleteOne({ filename });

        // Delete associated chunks from the chunks collection
        await gfs.collection(`${bucket}.chunks`).deleteMany({ files_id: file._id });

        res.status(200).json({ message: "File and chunks deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete("/delete-multiple/:bucket", async (req, res) => {
    try {
        const { bucket } = req.params;
        const { filenames } = req.body;

        if (!filenames || !Array.isArray(filenames) || filenames.length === 0) {
            return res.status(400).json({ error: "No filenames provided" });
        }

        const deleteResults = [];

        for (const filename of filenames) {
            const file = await gfs.collection(bucket).findOne({ filename });
            if (file) {
                await gfs.collection(bucket).deleteOne({ filename });
                await gfs.collection(`${bucket}.chunks`).deleteMany({ files_id: file._id });
                deleteResults.push({ filename, status: "Deleted" });
            } else {
                deleteResults.push({ filename, status: "Not Found" });
            }
        }

        res.status(200).json({ message: "Delete operation completed", results: deleteResults });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;
