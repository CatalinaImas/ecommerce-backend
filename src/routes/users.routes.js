import { Router } from 'express'
import {
  getUsers,
  getUserById,
  createUser,
  login,
  updateUser,
  deleteUser,
} from '../controllers/users.controller.js'
import { verifyToken, requireAdmin, optionalAuth } from '../middlewares/auth.middleware.js'
import { upload } from '../middlewares/upload.middleware.js'

const router = Router()

router.get('/', verifyToken, requireAdmin, getUsers)
router.post('/login', login)
router.get('/:id', verifyToken, getUserById)
router.post('/', optionalAuth, upload.single('avatar'), createUser)
router.put('/:id', verifyToken, upload.single('avatar'), updateUser)
router.delete('/:id', verifyToken, requireAdmin, deleteUser)

export default router
