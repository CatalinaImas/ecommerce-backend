import Category from '../models/Category.model.js'
import Product from '../models/Product.model.js'
import { handleError } from '../utils/handleError.js'

export const getCategories = async (_req, res) => {
  try {
    res.json(await Category.find().sort({ name: 1 }))
  } catch (error) {
    handleError(res, error)
  }
}

export const createCategory = async (req, res) => {
  try {
    if (!req.body.name) return res.status(400).json({ message: 'El nombre es obligatorio' })
    const category = await Category.create({ name: req.body.name })
    res.status(201).json(category)
  } catch (error) {
    handleError(res, error)
  }
}

export const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true, runValidators: true },
    )
    if (!category) return res.status(404).json({ message: 'Categoría no encontrada' })
    res.json(category)
  } catch (error) {
    handleError(res, error)
  }
}

export const deleteCategory = async (req, res) => {
  try {
    // No se puede borrar una categoria que todavia tiene productos
    const inUse = await Product.exists({ category: req.params.id })
    if (inUse) {
      return res.status(409).json({ message: 'La categoría tiene productos asociados' })
    }
    const category = await Category.findByIdAndDelete(req.params.id)
    if (!category) return res.status(404).json({ message: 'Categoría no encontrada' })
    res.json({ message: 'Categoría eliminada' })
  } catch (error) {
    handleError(res, error)
  }
}
