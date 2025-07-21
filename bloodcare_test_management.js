// === server/models/Test.js ===
const mongoose = require('mongoose');

const TestSchema = new mongoose.Schema({
  name: String,
  price: Number
});

module.exports = mongoose.model("Test", TestSchema);


// === server/routes/tests.js ===
const express = require('express');
const router = express.Router();
const Test = require('../models/Test');

// Get all tests
router.get('/', async (req, res) => {
  const tests = await Test.find();
  res.json(tests);
});

// Add new test
router.post('/', async (req, res) => {
  const { name, price } = req.body;
  const test = new Test({ name, price });
  await test.save();
  res.json(test);
});

// Update test
router.put('/:id', async (req, res) => {
  const { name, price } = req.body;
  const updated = await Test.findByIdAndUpdate(req.params.id, { name, price }, { new: true });
  res.json(updated);
});

// Delete test
router.delete('/:id', async (req, res) => {
  await Test.findByIdAndDelete(req.params.id);
  res.json({ message: 'Test deleted' });
});

module.exports = router;


// === server/index.js ===
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const testRoutes = require('./routes/tests');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/tests', testRoutes);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB error", err));

app.listen(5000, () => console.log("Server running on port 5000"));


// === server/.env ===
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/bloodcare


// === client/src/pages/ManageTests.jsx ===
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ManageTests() {
  const [tests, setTests] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

  const fetchTests = async () => {
    const res = await axios.get('http://localhost:5000/api/tests');
    setTests(res.data);
  };

  useEffect(() => {
    fetchTests();
  }, []);

  const addTest = async () => {
    await axios.post('http://localhost:5000/api/tests', { name, price });
    setName('');
    setPrice('');
    fetchTests();
  };

  const deleteTest = async (id) => {
    await axios.delete(`http://localhost:5000/api/tests/${id}`);
    fetchTests();
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Manage Tests</h2>
      <div className="mb-4 flex gap-2">
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Test Name" className="p-2 border rounded" />
        <input value={price} onChange={e => setPrice(e.target.value)} placeholder="Price" type="number" className="p-2 border rounded" />
        <button onClick={addTest} className="bg-blue-500 text-white px-4 py-2 rounded">Add</button>
      </div>
      <ul>
        {tests.map(test => (
          <li key={test._id} className="flex justify-between items-center mb-2">
            <span>{test.name} - ₹{test.price}</span>
            <button onClick={() => deleteTest(test._id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
