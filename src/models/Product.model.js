import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    // Referencia a la colección de categorías
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    // URL pública de la imagen (Cloudinary)
    image: { type: String, required: true },
    stock: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true },
)

export default mongoose.model('Product', productSchema)
