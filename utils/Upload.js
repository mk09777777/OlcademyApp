const mongoose = require('mongoose');
const fs = require('fs'); // Node.js built-in file system module
const path = require('path'); // Node.js built-in path module
const Firm = require("../models/Firm"); // Assuming Firm.js is in ../models/Firm.js

// 1. Define your MongoDB URI
const MONGODB_URI = "mongodb://127.0.0.1:27017/olcademy";

// 2. Specify the path to your JSON data file
const DATA_FILE_NAME = 'june24.json'; // Make sure this file is in the same directory as this script
const dataFilePath = path.join(__dirname, DATA_FILE_NAME);

async function importData() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB");

        // Read the JSON file
        const jsonData = fs.readFileSync(dataFilePath, 'utf8');
        let dataToInsert = JSON.parse(jsonData); // Use 'let' because we'll modify it

        // Ensure dataToInsert is an array (even if the file contains a single object)
        if (!Array.isArray(dataToInsert)) {
            dataToInsert = [dataToInsert];
        }

        // Pre-process each document to ensure latitude, longitude, and location.coordinates
        const processedData = dataToInsert.map(doc => {
            // Define default coordinates if not present or invalid
            const defaultLatitude = "43.9241439"; // Keep as string per schema
            const defaultLongitude = "-78.8746338"; // Keep as string per schema

            // Ensure latitude and longitude are strings, use default if missing
            doc.latitude = doc.latitude !== undefined && doc.latitude !== null && String(doc.latitude).trim() !== ''
                           ? String(doc.latitude)
                           : defaultLatitude;

            doc.longitude = doc.longitude !== undefined && doc.longitude !== null && String(doc.longitude).trim() !== ''
                            ? String(doc.longitude)
                            : defaultLongitude;

            // Ensure location field exists and has the correct type and coordinates
            if (!doc.location) {
                doc.location = {};
            }
            if (!doc.location.type) {
                doc.location.type = "Point";
            }
            // Ensure coordinates array is present and contains numbers
            // Convert latitude/longitude strings to numbers for coordinates array
            doc.location.coordinates = [
                parseFloat(doc.longitude), // Longitude first
                parseFloat(doc.latitude)   // Latitude second
            ];

            // Handle potential NaN from parseFloat if original string was truly unparseable
            if (isNaN(doc.location.coordinates[0]) || isNaN(doc.location.coordinates[1])) {
                console.warn(`Warning: Invalid coordinates for document with name "${doc.restaurantInfo?.name || 'Unknown'}" Applying default numeric coordinates.`);
                doc.location.coordinates = [
                    parseFloat(defaultLongitude),
                    parseFloat(defaultLatitude)
                ];
            }


            // --- Handle the 'reviews' field issue if not already resolved ---
            // Based on your schema, 'reviews' should be an array of ObjectIDs (references).
            // If your `june24.json` contains full review objects, you have two choices:
            // 1. **Remove them from the firm data before inserting:**
            //    This means you'd handle reviews separately, create Review documents,
            //    and then link their IDs to the firm (as discussed in Option 2 of previous answer).
            //    Example:
            //    delete doc.reviews; // If you expect them to be separate.
            // 2. **Adjust your Firm schema to embed reviews (Option 1 of previous answer):**
            //    If you change your Firm schema to embed reviews, then ensure the incoming
            //    review objects conform to that embedded schema. If they are still strings,
            //    you'd need a complex parsing logic here for each review string.
            //
            // For now, I'm assuming your `june24.json` does NOT have full review objects
            // for the `reviews` field, or that you've handled that separately.
            // If it *does* have full review objects and you want to use the current schema
            // (referencing), you will need a more complex import script that
            // first inserts reviews and then updates firms with their IDs.

            return doc;
        });

        // Optional: Clear existing data before inserting (USE WITH CAUTION!)
        // This will delete ALL documents in the Firm collection before adding new ones.
        // await Firm.deleteMany({});
        // console.log("Cleared existing Firm data.");

        // Insert the processed data
        const result = await Firm.insertMany(processedData);
        console.log(`Successfully inserted ${result.length} documents into the Firm collection.`);

    } catch (error) {
        console.error('Error importing data:', error);
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB");
    }
}

// Run the import function
importData();