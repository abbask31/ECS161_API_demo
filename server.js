import express from "express"
import path from "path";
import { readFileSync, writeFileSync } from "fs";

const app = express();
const port = 3000;
const __dirname = 'data'
const __filename = 'mockData.json'

app.use(express.json())

// Read mock data from file
const readData = () => {
    const dataPath = path.join(__dirname, __filename);
    const data = readFileSync(dataPath, 'utf8');
    return JSON.parse(data);
};

// Write mock data to file
const writeData = (data) => {
    const dataPath = path.join(__dirname, __filename);
    writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
};

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

// Route to display a simple message on the root URL
app.get('/', (req, res) => {
    res.send('Welcome to the Simple API Demo!');
});

// GET all items
app.get('/api/items', (req, res) => {
    const data = readData();
    res.json(data);
});

// GET item by id
app.get('/api/items/:id', (req, res) => {
    const data = readData();
    const item = data.find(i => i.id === parseInt(req.params.id, 10));
    if (item) { 
        res.json(item);
    } else {
        res.status(404).json({ message: 'Item not found' });
    }
});

// POST a new item
app.post('/api/items', (req, res) => {
    const data = readData();
    const newItem = {
        id: data.length > 0 ? data[data.length - 1].id + 1 : 1,
        name: req.body.name
    };
    data.push(newItem);
    writeData(data);
    res.status(201).json(newItem);
});

// DELETE an item by id
app.delete('/api/items/:id', (req, res) => {
    let data = readData();
    const itemId = parseInt(req.params.id, 10);
    data = data.filter(i => i.id !== itemId);
    writeData(data);
    res.status(204).end();
});