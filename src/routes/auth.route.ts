import express, { Request, Response, Application } from 'express'
import authController from '~/controllers/auth.controller'
const router = express.Router()
router.post('/login', authController.login)
router.post('/logout', authController.logout)
router.post('/reset-token', authController.resetToken)
router.post('/login-with-Google', authController.loginWithGoogleWebDashboard)
router.post('/google-signin', authController.loginWithGoogleMobile)
export default router
