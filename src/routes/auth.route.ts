import express, { Request, Response, Application } from 'express'
import authController from '~/controllers/auth.controller'
const router = express.Router()
router.post('/login', authController.login)
router.post('/reset-token', authController.resetToken)
export default router
