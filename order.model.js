import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  // Consignee (Receiver) Info
  consigneeName: { type: String, required: true },
  consigneePhone: { type: String, required: true },
  consigneeAddress: { type: String, required: true },
  consigneeCity: { type: String, required: true },

  // Shipment Info
  description: { type: String, required: true },
  weight: { type: Number, default: 0.5 },
  pieces: { type: Number, default: 1 },
  codAmount: { type: Number, default: 0 }, // Cash on Delivery amount in PKR

  // Courier
  courier: {
    type: String,
    enum: ['tcs', 'leopards', 'mp'],
    required: true
  },

  // Tracking
  trackingNumber: { type: String, default: '' },
  courierOrderId: { type: String, default: '' },

  // Status
  status: {
    type: String,
    enum: ['pending', 'booked', 'in_transit', 'out_for_delivery', 'delivered', 'returned', 'cancelled'],
    default: 'pending'
  },

  // Tracking history
  trackingHistory: [{
    status: String,
    location: String,
    timestamp: { type: Date, default: Date.now },
    description: String
  }],

  bookedAt: { type: Date },
}, { timestamps: true })

export default mongoose.model('Order', orderSchema)
