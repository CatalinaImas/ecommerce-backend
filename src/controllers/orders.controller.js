import Order from '../models/Order.model.js'
import Product from '../models/Product.model.js'
import { handleError } from '../utils/handleError.js'

// El admin ve todas las ordenes; un cliente solo las suyas
export const getOrders = async (req, res) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { userId: req.user.id }
    const orders = await Order.find(filter).populate('userId', 'name email').sort({ createdAt: -1 })
    res.json(orders)
  } catch (error) {
    handleError(res, error)
  }
}

export const createOrder = async (req, res) => {
  try {
    const { items } = req.body

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'La orden necesita al menos un producto' })
    }

    // Los precios se leen de la base de datos: no confiamos en los que manda el frontend
    const ids = items.map((item) => item.product)
    const products = await Product.find({ _id: { $in: ids } })

    const orderItems = []
    for (const item of items) {
      const product = products.find((p) => p._id.equals(item.product))
      const quantity = Number(item.quantity)

      if (!product || !Number.isInteger(quantity) || quantity < 1) {
        return res.status(400).json({ message: 'Hay un producto inválido en la orden' })
      }
      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity,
      })
    }

    const total = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

    const order = await Order.create({
      items: orderItems,
      total: Math.round(total * 100) / 100,
      userId: req.user.id,
    })

    res.status(201).json(order)
  } catch (error) {
    handleError(res, error)
  }
}
