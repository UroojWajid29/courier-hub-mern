import axios from 'axios'

const TCS_API_URL = process.env.TCS_API_URL || 'https://api.tcsexpress.com/api'
const TCS_API_KEY = process.env.TCS_API_KEY || 'DEMO_KEY'

// Book a shipment with TCS
export const tcsBookShipment = async (orderData) => {
  try {
    const payload = {
      api_key: TCS_API_KEY,
      consignee_name: orderData.consigneeName,
      consignee_phone: orderData.consigneePhone,
      consignee_address: orderData.consigneeAddress,
      consignee_city: orderData.consigneeCity,
      description: orderData.description,
      weight: orderData.weight,
      pieces: orderData.pieces,
      cod_amount: orderData.codAmount,
    }

    // In production, uncomment this:
    // const res = await axios.post(`${TCS_API_URL}/book`, payload)
    // return { success: true, trackingNumber: res.data.tracking_number, orderId: res.data.order_id }

    // DEMO MODE — returns mock data
    const mockTracking = 'TCS' + Date.now().toString().slice(-8)
    return {
      success: true,
      trackingNumber: mockTracking,
      orderId: 'TCS-ORD-' + Math.random().toString(36).slice(2, 8).toUpperCase(),
      message: 'Shipment booked successfully (Demo Mode)'
    }
  } catch (err) {
    return { success: false, message: err.response?.data?.message || 'TCS API error' }
  }
}

// Track a TCS shipment
export const tcsTrackShipment = async (trackingNumber) => {
  try {
    // In production:
    // const res = await axios.get(`${TCS_API_URL}/track/${trackingNumber}?api_key=${TCS_API_KEY}`)
    // return { success: true, data: res.data }

    // DEMO MODE
    return {
      success: true,
      data: {
        trackingNumber,
        status: 'In Transit',
        currentLocation: 'Karachi Hub',
        estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString('en-PK'),
        history: [
          { status: 'Picked Up', location: 'Lahore', time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
          { status: 'In Transit', location: 'Karachi Hub', time: new Date().toISOString() },
        ]
      }
    }
  } catch (err) {
    return { success: false, message: 'Tracking failed' }
  }
}
