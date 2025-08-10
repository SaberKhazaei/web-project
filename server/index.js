const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Product = require('./models/Product');
const User = require('./models/User');

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';
const MONGO_URI = process.env.MONGO_URI || 'mongodb://0.0.0.0:27017/shop';

mongoose.connect(MONGO_URI).then(async () => {
  console.log('Mongo connected');
  const count = await Product.countDocuments();
  if (count === 0) {
    await Product.insertMany([
      { name: 'Product 1', price: 10000, description: 'Sample product', image: 'https://via.placeholder.com/150' },
      { name: 'Product 2', price: 20000, description: 'Sample product', image: 'https://via.placeholder.com/150' },
      { name: 'Product 3', price: 30000, description: 'Sample product', image: 'https://via.placeholder.com/150' },
      { name: 'Product 4', price: 40000, description: 'Sample product', image: 'https://via.placeholder.com/150' },
      { name: 'Product 5', price: 50000, description: 'Sample product', image: 'https://via.placeholder.com/150' },
      { name: 'Product 6', price: 60000, description: 'Sample product', image: 'https://via.placeholder.com/150' }
    ]);
    console.log('Seeded products');
  }
}).catch(err => console.error('Mongo error', err));

app.post('/api/auth/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password required' });
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: 'User exists' });
  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ email, password: hashed });
  res.json({ id: user._id });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: 'Invalid credentials' });
  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });
  res.json({ token });
});

app.get('/api/products', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
