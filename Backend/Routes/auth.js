import express from 'express'
import bcrypt from 'bcryptjs'
import { prisma } from '../db.js'
import { signAccessToken, signRefreshToken, verifyRefreshToken, hashToken } from '../utils/token.js'

const router = express.Router()

// Register user
router.post('/register', async (req, res) => {
  const { email, password, bankId, fullName, role = 'client' } = req.body
  try {
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) return res.status(400).json({ message: 'Email already exists' })

    const hash = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: { email, passwordHash: hash, fullName, bankId }
    })

    // assign role
    const r = await prisma.role.findUnique({ where: { name: role } })
    if (r) {
      await prisma.userRole.create({ data: { userId: user.id, roleId: r.id } })
    }

    res.status(201).json({ message: 'User created', user: { id: user.id, email } })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

// Login
router.post('/login', async (req, res) => {
  const { email, password, bankId } = req.body
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { roles: { include: { role: true } } }
    })
    if (!user || user.bankId !== bankId) return res.status(401).json({ message: 'Invalid credentials' })

    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' })

    const accessToken = signAccessToken(user)
    const refreshToken = signRefreshToken(user)
    const tokenHash = hashToken(refreshToken)

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      }
    })

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false
    })

    res.json({ accessToken, user: { id: user.id, email: user.email, roles: user.roles.map(r => r.role.name) } })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

// Refresh token
router.post('/refresh', async (req, res) => {
  const token = req.cookies.refreshToken
  if (!token) return res.status(401).json({ message: 'No token' })

  try {
    const payload = verifyRefreshToken(token)
    const tokenHash = hashToken(token)
    const dbToken = await prisma.refreshToken.findFirst({ where: { tokenHash, revoked: false } })
    if (!dbToken) return res.status(401).json({ message: 'Invalid token' })

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      include: { roles: { include: { role: true } } }
    })

    const newAccess = signAccessToken(user)
    res.json({ accessToken: newAccess })
  } catch (err) {
    res.status(401).json({ message: 'Invalid refresh token' })
  }
})

// Logout
router.post('/logout', async (req, res) => {
  const token = req.cookies.refreshToken
  if (token) {
    const tokenHash = hashToken(token)
    await prisma.refreshToken.updateMany({ where: { tokenHash }, data: { revoked: true } })
  }
  res.clearCookie('refreshToken')
  res.json({ message: 'Logged out' })
})

export default router
