const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
require('dotenv').config();


const signup = async (req, res) => {
const { name, email, password } = req.body;
if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });
try {
const exists = await User.findOne({ where: { email } });
if (exists) return res.status(400).json({ message: 'Email already registered' });
const hashed = await bcrypt.hash(password, 10);
const user = await User.create({ name, email, password: hashed });
return res.status(201).json({ id: user.id, name: user.name, email: user.email });
} catch (err) {
console.error(err);
return res.status(500).json({ message: 'Server error' });
}
};


const login = async (req, res) => {
const { email, password } = req.body;
if (!email || !password) return res.status(400).json({ message: 'Missing fields' });
try {
const user = await User.findOne({ where: { email } });
if (!user) return res.status(400).json({ message: 'Invalid credentials' });
const match = await bcrypt.compare(password, user.password);
if (!match) return res.status(400).json({ message: 'Invalid credentials' });


const payload = { id: user.id, email: user.email, role: user.role };
const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1d' });
return res.json({ token, user: payload });
} catch (err) {
console.error(err);
return res.status(500).json({ message: 'Server error' });
}
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'name', 'email', 'role'],
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};



module.exports = { signup, login, getProfile };