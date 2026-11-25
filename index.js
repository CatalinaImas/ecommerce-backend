// dotenv tiene que cargarse primero: Cloudinary y MercadoPago leen process.env al importarse
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { connectDB } from './src/config/db.js'
import usersRoutes from './src/routes/users.routes.js'
import productsRoutes from './src/routes/products.routes.js'
import ordersRoutes from './src/routes/orders.routes.js'
import paymentsRoutes from './src/routes/payments.routes.js'
import categoriesRoutes from './src/routes/categories.routes.js'

const app = express()
const PORT = process.env.PORT || 3000

// Middlewares globales
app.use(cors())
app.use(express.json())

app.get('/', (_req, res) => {
  res.json({ message: 'API de Urban Plant Cookies funcionando 🍪' })
})

// Rutas
app.use('/api/users', usersRoutes)
app.use('/api/products', productsRoutes)
app.use('/api/orders', ordersRoutes)
app.use('/api/payments', paymentsRoutes)
app.use('/api/categories', categoriesRoutes)

// Manejo de errores (por ejemplo, una imagen que supera los 5 MB)
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(err.status || 400).json({ message: err.message || 'Error en la petición' })
})

connectDB().then(() => {
  app.listen(PORT, () => console.log(`🚀 Servidor escuchando en el puerto ${PORT}`))
})
