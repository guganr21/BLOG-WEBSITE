const express = require('express');
const cors = require('cors');
const { ObjectId } = require('mongodb');
const { connectDB, getDB } = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
// 1. Create Blog
app.post('/blogs', async (req, res) => {
    try {
        const { title, content, author } = req.body;
        const newBlog = {
            title,
            content,
            author,
            createdAt: new Date()
        };
        const result = await getDB().collection('blogs').insertOne(newBlog);
        res.status(201).json({ ...newBlog, _id: result.insertedId });
    } catch (error) {
        res.status(500).json({ message: "Error creating blog", error });
    }
});

// 2. Get All Blogs
app.get('/blogs', async (req, res) => {
    try {
        const blogs = await getDB().collection('blogs').find().toArray();
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ message: "Error fetching blogs" });
    }
});

// 3. Update Blog
app.put('/blogs/:id', async (req, res) => {
    try {
        const { title, content, author } = req.body;
        const result = await getDB().collection('blogs').updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: { title, content, author } }
        );
        res.json({ message: "Blog updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Update failed" });
    }
});

// 4. Delete Blog
app.delete('/blogs/:id', async (req, res) => {
    try {
        await getDB().collection('blogs').deleteOne({ _id: new ObjectId(req.params.id) });
        res.json({ message: "Blog deleted" });
    } catch (error) {
        res.status(500).json({ message: "Delete failed" });
    }
});

// Initialize DB then start server
connectDB().then(() => {
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
});
