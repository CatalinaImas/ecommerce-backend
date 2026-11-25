import dns from 'node:dns'
dns.setServers(['8.8.8.8', '1.1.1.1'])
import mongoose from 'mongoose'

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Conectado a MongoDB Atlas')
  } catch (error) {
    console.error('❌ Error al conectar con MongoDB:', error.message)
    // Si la base de datos no está disponible, no tiene sentido que el servidor siga corriendo
    process.exit(1)
  }
}
