import { MercadoPagoConfig, Preference, Payment } from 'mercadopago'
import Order from '../models/Order.model.js'

const getClient = () => new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN })

export const createPreference = async (req, res) => {
  try {
    const { orderId } = req.body
    let items = req.body.items

    // Si viene el id de una orden, los items y precios se toman de la base de datos
    if (orderId) {
      const order = await Order.findOne({ _id: orderId, userId: req.user.id })
      if (!order) return res.status(404).json({ message: 'Orden no encontrada' })
      items = order.items.map((item) => ({
        id: String(item.product),
        title: item.name,
        quantity: item.quantity,
        unit_price: item.price,
        currency_id: 'ARS',
      }))
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'No hay productos para pagar' })
    }

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'
    const backendUrl = process.env.BACKEND_URL || ''

    const body = {
      items: items.map((item) => ({
        id: item.id,
        title: item.title,
        quantity: Number(item.quantity),
        unit_price: Number(item.unit_price),
        currency_id: item.currency_id || 'ARS',
      })),
      back_urls: {
        success: `${frontendUrl}/payment/success`,
        failure: `${frontendUrl}/payment/failure`,
        pending: `${frontendUrl}/payment/pending`,
      },
      external_reference: orderId ? String(orderId) : undefined,
    }

    // MercadoPago solo acepta auto_return y webhook con URLs públicas (https).
    // En localhost se omiten para que la preferencia se pueda crear igual.
    if (frontendUrl.startsWith('https')) body.auto_return = 'approved'
    if (backendUrl.startsWith('https')) {
      body.notification_url = `${backendUrl}/api/payments/webhook`
    }

    const preference = await new Preference(getClient()).create({ body })

    res.json({
      id: preference.id,
      init_point: preference.init_point,
      sandbox_init_point: preference.sandbox_init_point,
    })
  } catch (error) {
    console.error('Error al crear la preferencia de MercadoPago:', error)
    res.status(500).json({ message: 'No se pudo crear la preferencia de pago' })
  }
}

const STATUS_MAP = { approved: 'paid', rejected: 'rejected', cancelled: 'rejected' }

export const webhook = async (req, res) => {
  try {
    const type = req.body?.type ?? req.query.type ?? req.query.topic
    const paymentId = req.body?.data?.id ?? req.query['data.id'] ?? req.query.id

    if (type === 'payment' && paymentId) {
      const payment = await new Payment(getClient()).get({ id: paymentId })
      const status = STATUS_MAP[payment.status]

      // external_reference es el id de nuestra orden
      if (payment.external_reference && status) {
        await Order.findByIdAndUpdate(payment.external_reference, {
          status,
          paymentId: String(payment.id),
        })
      }
    }
  } catch (error) {
    // Aunque algo falle, respondemos 200 para que mercadopago no reintente sin parar
    console.error('Error en el webhook de MercadoPago:', error.message)
  }

  res.sendStatus(200)
}
