const express = require('express')
const router = express.Router()
const fetch = require('node-fetch')
const { verifyToken } = require('../middleware/auth')

const IMG_BB_API_KEY = process.env.IMG_BB_KEY

// Upload image to imgBB
router.post('/image', verifyToken, async (req, res) => {
  try {
    const { image } = req.body // base64 encoded image

    if (!image) {
      return res.status(400).json({ message: 'Image data required' })
    }

    if (!IMG_BB_API_KEY) {
      return res.status(500).json({ message: 'Image upload service not configured' })
    }

    // For production: convert base64 and upload to imgBB
    // For now: return mock URL
    const imageUrl = `https://via.placeholder.com/300x200?text=Task+Image`

    return res.status(200).json({
      success: true,
      image: { url: imageUrl }
    })
  } catch (error) {
    console.error('Upload error:', error)
    res.status(500).json({ message: 'Error uploading image' })
  }
})

module.exports = router
