import express from 'express'
import { getCouriers, getCities } from '../controllers/courier.controller.js'
const router = express.Router()
router.get('/', getCouriers)
router.get('/cities', getCities)
export default router
