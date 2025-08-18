const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Ensure dotenv is configured properly
const result = dotenv.config();
if (result.error) {
  console.error("Error loading .env file:", result.error);
  process.exit(1);
}

// Log the MongoDB URI (with password masked for security)
const maskUri = (uri) => {
  if (!uri) return "undefined";
  try {
    const maskedUri = new URL(uri);
    if (maskedUri.password) {
      maskedUri.password = "*****";
    }
    return maskedUri.toString();
  } catch (e) {
    return "invalid URI format";
  }
};

console.log("MongoDB Atlas URI:", maskUri(process.env.MONGO_ATLAS_URI));

async function verifyDatabase() {
  try {
    // Connect to MongoDB using the Atlas URI
    if (!process.env.MONGO_ATLAS_URI) {
      throw new Error("MONGO_ATLAS_URI is not defined in environment variables");
    }
    
    await mongoose.connect(process.env.MONGO_ATLAS_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log("Successfully connected to MongoDB Atlas!");
    console.log(`Database name: ${mongoose.connection.db.databaseName}`);
    
    // List collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("Available collections:", collections.map(c => c.name));
    
    // Test creating a collection document without an image
    const Collection = require("./models/marketing-dashboard/Collection");
    
    const testCollection = new Collection({
      title: "Test Collection",
      description: "This is a test collection created by verify-mongodb.js",
      isDefault: false,
      status: "Active"
    });
    
    await testCollection.save();
    console.log("Test collection created successfully!");
    
    // Find the test collection to verify it was saved
    const savedCollection = await Collection.findOne({ title: "Test Collection" });
    console.log("Retrieved test collection:", savedCollection);
    
    // Clean up - delete the test collection
    await Collection.deleteOne({ _id: savedCollection._id });
    console.log("Test collection deleted successfully!");
    
    await mongoose.connection.close();
    console.log("Database connection closed.");
  } catch (error) {
    console.error("Database verification failed:", error);
  }
}

verifyDatabase();