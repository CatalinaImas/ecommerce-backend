// Carga usuarios de prueba, categorías y productos iniciales.
// Uso: npm run seed   (se puede correr más de una vez sin duplicar datos)
import 'dotenv/config'
import bcrypt from 'bcrypt'
import { connectDB } from './src/config/db.js'
import User from './src/models/User.model.js'
import Category from './src/models/Category.model.js'
import Product from './src/models/Product.model.js'

const users = [
  { name: 'Admin', email: 'admin@admin.com', password: '1234', role: 'admin', province: 'Buenos Aires' },
  { name: 'Cliente', email: 'cliente@cliente.com', password: '1234', role: 'client', province: 'Buenos Aires' },
]

const categories = ['Clásicas', 'Especiales', 'Avena', 'Intensos', 'Frutales', 'Café', 'Peanut Butter']

const products = [
  { name: 'NYC Classic Choco Chunk', price: 7.5, category: 'Clásicas', image: '/assets/images/products/product-1.png', description: 'Cookie plant-based estilo New York, con trozos grandes de chocolate, centro suave y bordes crocantes.' },
  { name: 'Matcha White Bliss', price: 8, category: 'Especiales', image: '/assets/images/products/product-2.png', description: 'Cookie verde de matcha con chocolate blanco vegano.' },
  { name: 'Salted Caramel Oat Cookie', price: 7, category: 'Avena', image: '/assets/images/products/product-3.png', description: 'Cookie de avena con caramelo salado.' },
  { name: 'Double Dark Brooklyn Bite', price: 8.5, category: 'Intensos', image: '/assets/images/products/product-4.png', description: 'Cookie intensa de cacao y chips de chocolate oscuro.' },
  { name: 'Peanut Butter Soho Soft', price: 7.5, category: 'Peanut Butter', image: '/assets/images/products/product-5.png', description: 'Cookie suave de manteca de maní.' },
  { name: 'Blueberry Lemon Crumble', price: 8, category: 'Frutales', image: '/assets/images/products/product-6.png', description: 'Cookie frutal con arándanos y limón.' },
  { name: 'Almond Espresso Crunch', price: 8.5, category: 'Café', image: '/assets/images/products/product-7.png', description: 'Cookie crocante con almendras y café espresso.' },
  { name: 'Vegan S’mores Midtown', price: 9, category: 'Especiales', image: '/assets/images/products/product-8.png', description: 'Cookie especial con malvaviscos veganos y chocolate.' },
]

await connectDB()

// Usuarios: las contraseñas se hashean con bcrypt antes de guardarse
for (const user of users) {
  const hashed = await bcrypt.hash(user.password, 10)
  await User.findOneAndUpdate(
    { email: user.email },
    { ...user, password: hashed },
    { upsert: true, setDefaultsOnInsert: true },
  )
  console.log(`✔ Usuario ${user.email}`)
}

// Categorías
const categoryDocs = {}
for (const name of categories) {
  categoryDocs[name] = await Category.findOneAndUpdate(
    { name },
    { name },
    { upsert: true, new: true },
  )
}
console.log(`✔ ${categories.length} categorías`)

// Productos (solo si todavía no hay ninguno)
if ((await Product.countDocuments()) === 0) {
  await Product.insertMany(
    products.map((p) => ({ ...p, category: categoryDocs[p.category]._id, stock: 100 })),
  )
  console.log(`✔ ${products.length} productos`)
} else {
  console.log('• Ya hay productos cargados, no se agregan los de ejemplo')
}

process.exit()
