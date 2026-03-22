const { MongoClient } = require('mongodb');
require('dotenv').config();

const client = new MongoClient(process.env.MONGO_URI);
let db;

async function connectDB() {
    try {
        await client.connect();
        console.log("✅ Connected to MongoDB");
        db = client.db('blogDB'); // Database name
    } catch (err) {
        console.error("❌ MongoDB Connection Error:", err);
        process.exit(1);
    }
}

const getDB = () => db;

module.exports = { connectDB, getDB };
