import mongoose from 'mongoose'

const orderItemSchema = new mongoose.Schema(
  {
    // Cada item referencia al producto por su ID
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    // Guardamos nombre y precio al momento de la compra
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false },
)

const orderSchema = new mongoose.Schema(
  {
    items: { type: [orderItemSchema], validate: (v) => v.length > 0 },
    total: { type: Number, required: true, min: 0 },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    // Lo actualiza el webhook de MercadoPago
    status: { type: String, enum: ['pending', 'paid', 'rejected'], default: 'pending' },
    paymentId: { type: String },
  },
  { timestamps: true },
)

export default mongoose.model('Order', orderSchema)
