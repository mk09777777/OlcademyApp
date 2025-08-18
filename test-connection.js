const mongoose = require("mongoose");
require("dotenv").config();

async function testConnection() {
  try {
    await mongoose.connect(process.env.MONGO_LOCAL_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Successfully connected to MongoDB!");

    // Try to get collections
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    console.log(
      "Available collections:",
      collections.map((c) => c.name)
    );

    await mongoose.connection.close();
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
  }
}

testConnection();
