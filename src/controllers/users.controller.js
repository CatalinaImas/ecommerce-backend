import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/User.model.js'
import { handleError } from '../utils/handleError.js'

const ROLES = ['admin', 'client']

// Un usuario solo puede ver/editar su propia cuenta, salvo que sea admin
const isSelfOrAdmin = (req) => req.user.role === 'admin' || req.user.id === req.params.id

export const getUsers = async (_req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 })
    res.json(users)
  } catch (error) {
    handleError(res, error)
  }
}

export const getUserById = async (req, res) => {
  try {
    if (!isSelfOrAdmin(req)) {
      return res.status(403).json({ message: 'No podés ver a otro usuario' })
    }
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' })
    res.json(user)
  } catch (error) {
    handleError(res, error)
  }
}

// Registro. La contraseña se guarda hasheada con bcrypt, nunca en texto plano
export const createUser = async (req, res) => {
  try {
    const { name, email, password, birthDate, province, role } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Nombre, email y contraseña son obligatorios' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    // Solo un admin logueado puede crear usuarios con un rol distinto de "client"
    const finalRole = req.user?.role === 'admin' && ROLES.includes(role) ? role : 'client'

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: finalRole,
      birthDate: birthDate || undefined,
      province,
      avatar: req.file?.path ?? '',
    })

    res.status(201).json(user)
  } catch (error) {
    handleError(res, error)
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ message: 'Email y contraseña son obligatorios' })
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() })
    // Mismo mensaje si falla el email o la contraseña (no revelamos cuál)
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Email o contraseña incorrectos' })
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    })

    res.json({ token, user })
  } catch (error) {
    handleError(res, error)
  }
}

export const updateUser = async (req, res) => {
  try {
    if (!isSelfOrAdmin(req)) {
      return res.status(403).json({ message: 'No podés editar a otro usuario' })
    }

    const { name, email, password, birthDate, province, role } = req.body
    const updates = {}

    if (name) updates.name = name
    if (email) updates.email = email
    if (birthDate) updates.birthDate = birthDate
    if (province) updates.province = province
    if (password) updates.password = await bcrypt.hash(password, 10)
    if (req.file) updates.avatar = req.file.path
    // El rol solo lo puede cambiar un admin
    if (req.user.role === 'admin' && ROLES.includes(role)) updates.role = role

    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    })
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' })

    res.json(user)
  } catch (error) {
    handleError(res, error)
  }
}

export const deleteUser = async (req, res) => {
  try {
    if (req.user.id === req.params.id) {
      return res.status(400).json({ message: 'No podés eliminar tu propia cuenta' })
    }
    const user = await User.findByIdAndDelete(req.params.id)
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' })
    res.json({ message: 'Usuario eliminado' })
  } catch (error) {
    handleError(res, error)
  }
}
