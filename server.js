import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'

import authRoutes from './routes/auth.routes.js'
import orderRoutes from './routes/order.routes.js'
import courierRoutes from './routes/courier.routes.js'
import dashboardRoutes from './routes/dashboard.routes.js'
import adminRoutes from './routes/admin.routes.js'

dotenv.config()

const app = express()

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }))
app.use(express.json())
app.use(cookieParser())

app.use('/api/auth', authRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/couriers', courierRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/admin', adminRoutes)

app.get('/api/health', (req, res) => res.json({ status: 'OK' }))

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({ success: false, message: err.message || 'Server Error' })
})

const PORT = process.env.PORT || 5000
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/courier_dashboard')
  .then(() => {
    console.log('✅ MongoDB Connected')
    app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`))
  })
  .catch(err => { console.error('❌ DB Error:', err); process.exit(1) })
