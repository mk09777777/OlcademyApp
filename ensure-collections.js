require('dotenv').config();
const mongoose = require('mongoose');

async function ensureCollections() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_ATLAS_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      writeConcern: { w: 'majority' }
    });
    
    console.log('Connected to MongoDB');
    console.log('Database name:', mongoose.connection.db.databaseName);
    
    // Check if the acknowledgments collection exists
    const collections = await mongoose.connection.db.listCollections({ name: 'acknowledgments' }).toArray();
    
    if (collections.length === 0) {
      // Create the acknowledgments collection if it doesn't exist
      console.log('Creating acknowledgments collection...');
      await mongoose.connection.db.createCollection('acknowledgments');
      console.log('Acknowledgments collection created successfully');
    } else {
      console.log('Acknowledgments collection already exists');
    }
    
    // Insert a test document to ensure the collection is working
    const result = await mongoose.connection.db.collection('acknowledgments').insertOne({
      title: 'Test Document from ensure-collections.js',
      description: 'This document was created to ensure the acknowledgments collection exists and is working properly',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    console.log('Test document inserted:', result);
    
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
  }
}

ensureCollections();