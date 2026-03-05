const express = require('express')
const router = express.Router()
const User = require('../models/User')
const { verifyToken, permit } = require('../middleware/auth')

// GET current user profile
router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json(user)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Error fetching user' })
  }
})

// GET all users (admin only)
router.get('/', verifyToken, permit('admin'), async (req, res) => {
  try {
    const users = await User.find().select('-password')
    res.json(users)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Error fetching users' })
  }
})

// GET top 6 workers by coins
router.get('/top-workers', async (req, res) => {
  try {
    const workers = await User.find({ role: 'worker' })
      .select(['name', 'email', 'coin', 'photoURL', 'createdAt'])
      .sort({ coin: -1 })
      .limit(6)
    
    res.json(workers)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Error fetching top workers' })
  }
})

// PUT update user role (admin only)
router.put('/role/:id', verifyToken, permit('admin'), async (req, res) => {
  try {
    const { role } = req.body
    if (!['worker', 'buyer', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' })
    }

    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ message: 'User not found' })

    user.role = role
    await user.save()

    res.json({ message: 'User role updated', user })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Error updating user' })
  }
})

// DELETE user (admin only)
router.delete('/:id', verifyToken, permit('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ message: 'User not found' })

    await User.findByIdAndDelete(req.params.id)
    res.json({ message: 'User deleted' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Error deleting user' })
  }
})

module.exports = router
