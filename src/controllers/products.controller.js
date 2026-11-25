import Product from '../models/Product.model.js'
import { handleError } from '../utils/handleError.js'

export const getProducts = async (_req, res) => {
  try {
    const products = await Product.find().populate('category', 'name').sort({ createdAt: -1 })
    res.json(products)
  } catch (error) {
    handleError(res, error)
  }
}

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name')
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' })
    res.json(product)
  } catch (error) {
    handleError(res, error)
  }
}

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body
    // req.file.path es la URL publica de la imagen en Cloudinary
    const image = req.file?.path ?? req.body.image

    if (!name || !description || price === undefined || !category || !image) {
      return res
        .status(400)
        .json({ message: 'Nombre, descripción, precio, categoría e imagen son obligatorios' })
    }

    const product = await Product.create({ name, description, price, category, image, stock })
    await product.populate('category', 'name')
    res.status(201).json(product)
  } catch (error) {
    handleError(res, error)
  }
}

export const updateProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body
    const updates = { name, description, price, category, stock }
    // Si no se subio una imagen nueva, se conserva la que ya tenia
    if (req.file) updates.image = req.file.path

    // Sacamos los campos que no vinieron para no pisarlos con undefined
    Object.keys(updates).forEach((key) => updates[key] === undefined && delete updates[key])

    const product = await Product.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).populate('category', 'name')
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' })

    res.json(product)
  } catch (error) {
    handleError(res, error)
  }
}

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' })
    res.json({ message: 'Producto eliminado' })
  } catch (error) {
    handleError(res, error)
  }
}
