const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Product = require('./models/Product');
const User = require('./models/User');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const MONGO_URI = process.env.MONGO_URI || 'mongodb://0.0.0.0:27017/webstore';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    seedProducts();
  })
  .catch(err => console.error('MongoDB connection error', err));

async function seedProducts() {
  const count = await Product.countDocuments();
  if (count === 0) {
    await Product.insertMany([
      { name: 'Product 1', price: 10, imageUrl: 'https://via.placeholder.com/150', description: 'Sample product 1' },
      { name: 'Product 2', price: 20, imageUrl: 'https://via.placeholder.com/150', description: 'Sample product 2' },
      { name: 'Product 3', price: 30, imageUrl: 'https://via.placeholder.com/150', description: 'Sample product 3' },
      { name: 'Product 4', price: 40, imageUrl: 'https://via.placeholder.com/150', description: 'Sample product 4' },
      { name: 'Product 5', price: 50, imageUrl: 'https://via.placeholder.com/150', description: 'Sample product 5' },
      { name: 'Product 6', price: 60, imageUrl: 'https://via.placeholder.com/150', description: 'Sample product 6' }
    ]);
    console.log('Seeded products');
  }
}

app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'username and password required' });
  }
  const existing = await User.findOne({ username });
  if (existing) {
    return res.status(400).json({ message: 'user exists' });
  }
  const hashed = await bcrypt.hash(password, 10);
  await User.create({ username, password: hashed });
  res.json({ message: 'user created' });
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  console.log('Login attempt', { username });
  let user = await User.findOne({ username });
  if (!user) {
    console.log('User not found', username, '- creating');
    const hashed = await bcrypt.hash(password, 10);
    user = await User.create({ username, password: hashed });
  } else {
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      console.log('Invalid password for', username);
      return res.status(400).json({ message: 'invalid credentials' });
    }
  }
  const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '1d' });
  console.log('Login success', username);
  res.json({ token });
});

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (auth) {
    const token = auth.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ message: 'invalid token' });
    }
  } else {
    res.status(401).json({ message: 'no token provided' });
  }
}

app.get('/api/profile', authMiddleware, (req, res) => {
  res.json({ username: req.user.username });
});

app.get('/api/products', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// Get a single product by id
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'not found' });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: 'invalid id' });
  }
});

// Add a product to the authenticated user's cart
app.post('/api/cart', authMiddleware, async (req, res) => {
  const { productId } = req.body;
  if (!productId) return res.status(400).json({ message: 'productId required' });
  const user = await User.findById(req.user.id);
  user.cart.push(productId);
  await user.save();
  res.json({ message: 'added to cart' });
});

// Get the authenticated user's cart
app.get('/api/cart', authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.id).populate('cart');
  res.json(user.cart);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
