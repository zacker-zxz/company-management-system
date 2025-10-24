const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;
const dbName = 'zacker_management';

let client;
let db;

async function connectDB() {
  try {
    client = new MongoClient(uri);
    await client.connect();
    console.log('✅ Connected to MongoDB');

    db = client.db(dbName);
    return db;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
}

function getDB() {
  if (!db) {
    throw new Error('Database not connected. Call connectDB() first.');
  }
  return db;
}

async function closeDB() {
  if (client) {
    await client.close();
    console.log('🔒 MongoDB connection closed');
  }
}

module.exports = { connectDB, getDB, closeDB };