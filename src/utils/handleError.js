// Responde con el código HTTP correcto según el tipo de error de Mongoose
export const handleError = (res, error) => {
  console.error(error)

  if (error.name === 'CastError') {
    return res.status(400).json({ message: 'El id enviado no es válido' })
  }
  if (error.name === 'ValidationError') {
    return res.status(400).json({ message: error.message })
  }
  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern ?? {})[0] ?? 'valor'
    return res.status(409).json({ message: `Ya existe un registro con ese ${field}` })
  }
  return res.status(500).json({ message: 'Error interno del servidor' })
}
