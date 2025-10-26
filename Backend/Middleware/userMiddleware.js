import jwt from 'jsonwebtoken'

export const requireAuth = (roles = []) => {
  return (req, res, next) => {
    const header = req.headers.authorization
    if (!header) return res.status(401).json({ message: 'No token' })

    const token = header.split(' ')[1]
    try {
      const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
      req.user = payload
      if (roles.length && !roles.some(r => payload.roles.includes(r))) {
        return res.status(403).json({ message: 'Forbidden' })
      }
      next()
    } catch (err) {
      res.status(401).json({ message: 'Invalid token' })
    }
  }
}
