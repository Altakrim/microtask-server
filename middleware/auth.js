const jwt = require('jsonwebtoken')

function verifyToken(req, res, next) {
  const header = req.headers.authorization
  if (!header) return res.status(401).json({ message: 'No token provided' })
  const parts = header.split(' ')
  if (parts.length !== 2) return res.status(401).json({ message: 'Token error' })
  const [scheme, token] = parts
  if (!/^Bearer$/i.test(scheme)) return res.status(401).json({ message: 'Malformed token' })
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Invalid token' })
    req.user = decoded
    next()
  })
}

function permit(...allowed) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' })
    if (allowed.includes(req.user.role)) return next()
    return res.status(403).json({ message: 'Forbidden' })
  }
}

module.exports = { verifyToken, permit }
