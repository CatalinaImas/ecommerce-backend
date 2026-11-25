// Va siempre despues de verifyToken (que es quien completa req.user)
export const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Acceso solo para administradores' })
  }
  next()
}
