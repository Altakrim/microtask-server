const express = require('express')
const router = express.Router()
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// basic validation helpers
function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\\.,;:\s@\"]+\.)+[^<>()[\]\\.,;:\s@\"]{2,})$/i
  return re.test(String(email).toLowerCase())
}

function validatePassword(pw) {
  return typeof pw === 'string' && pw.length >= 6
}

// register route
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, photoURL } = req.body
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' })
    }
    if (!validateEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' })
    }
    if (!validatePassword(password)) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' })
    }
    const existing = await User.findOne({ email })
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' })
    }
    const hashed = await bcrypt.hash(password, 10)
    const coin = role === 'buyer' ? 50 : 10
    const user = new User({ name, email, password: hashed, role, coin, photoURL })
    await user.save()
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    })
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, coin: user.coin, photoURL: user.photoURL } })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

// login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' })
    }
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }
    const match = await bcrypt.compare(password, user.password)
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    })
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, coin: user.coin, photoURL: user.photoURL } })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router
