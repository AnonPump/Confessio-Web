const express = require('express');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Endpoint to handle confession submission
app.post('/submit', (req, res) => {
    const { title, content } = req.body;

    if (!title || !content) {
        return res.status(400).json({ message: 'Title and content are required' });
    }

    // Load existing confessions or initialize an empty array
    let confessions = [];
    if (fs.existsSync('confessions.json')) {
        confessions = JSON.parse(fs.readFileSync('confessions.json', 'utf-8'));
    }

    // Add new confession and save
    const newConfession = { title, content, timestamp: new Date().toISOString() };
    confessions.push(newConfession);
    fs.writeFileSync('confessions.json', JSON.stringify(confessions, null, 2));

    res.status(200).json({ message: 'Confession submitted successfully' });
});

// Endpoint to retrieve all confessions
app.get('/confessions', (req, res) => {
    const confessions = JSON.parse(fs.readFileSync('confessions.json', 'utf-8'));
    res.status(200).json(confessions);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});