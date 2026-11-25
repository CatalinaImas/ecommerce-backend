import { Router } from 'express'
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/products.controller.js'
import { verifyToken, requireAdmin } from '../middlewares/auth.middleware.js'
import { upload } from '../middlewares/upload.middleware.js'

const router = Router()

router.get('/', getProducts)
router.get('/:id', getProductById)
router.post('/', verifyToken, requireAdmin, upload.single('image'), createProduct)
router.put('/:id', verifyToken, requireAdmin, upload.single('image'), updateProduct)
router.delete('/:id', verifyToken, requireAdmin, deleteProduct)

export default router
