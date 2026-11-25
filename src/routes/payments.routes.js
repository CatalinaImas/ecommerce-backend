import { Router } from 'express'
import { createPreference, webhook } from '../controllers/payments.controller.js'
import { verifyToken } from '../middlewares/auth.middleware.js'

const router = Router()

router.post('/create-preference', verifyToken, createPreference)
// Sin verifyToken: lo llaman los servidores de MercadoPago, no nuestro frontend
router.post('/webhook', webhook)

export default router
