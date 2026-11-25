import jwt from 'jsonwebtoken'

// Lee "Authorization: Bearer <token>" y devuelve el token (o null)
const getToken = (req) => {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) return null
  return header.split(' ')[1] || null
}

export const verifyToken = (req, res, next) => {
  const token = getToken(req)
  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' })
  }

  try {
    // Si es valido, guardamos el payload (id y role) en req.user
    req.user = jwt.verify(token, process.env.JWT_SECRET)
    next()
  } catch {
    return res.status(401).json({ message: 'Token inválido o expirado' })
  }
}

// Igual que verifyToken, pero si no hay token (o es inválido) sigue sin error.
// Se usa en el registro: un admin logueado puede elegir el rol del nuevo usuario.
export const optionalAuth = (req, _res, next) => {
  const token = getToken(req)
  if (token) {
    try {
      req.user = jwt.verify(token, process.env.JWT_SECRET)
    } catch {
      // token inválido: se trata como visitante
    }
  }
  next()
}

export { requireAdmin } from './admin.middleware.js'
