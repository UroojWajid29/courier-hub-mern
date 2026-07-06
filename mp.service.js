import axios from 'axios'

const MP_API_URL = process.env.MP_API_URL || 'https://api.mundialpak.com/v1'
const MP_USERNAME = process.env.MP_USERNAME || 'DEMO_USER'
const MP_PASSWORD = process.env.MP_PASSWORD || 'DEMO_PASS'

const getMPToken = async () => {
  // In production: authenticate and get bearer token
  // const res = await axios.post(`${MP_API_URL}/auth/login`, { username: MP_USERNAME, password: MP_PASSWORD })
  // return res.data.token
  return 'DEMO_TOKEN'
}

export const mpBookShipment = async (orderData) => {
  try {
    const token = await getMPToken()

    const payload = {
      consignee: {
        name: orderData.consigneeName,
        phone: orderData.consigneePhone,
        address: orderData.consigneeAddress,
        city: orderData.consigneeCity,
      },
      description: orderData.description,
      weight: orderData.weight,
      pieces: orderData.pieces,
      cod: orderData.codAmount,
    }

    // In production:
    // const res = await axios.post(`${MP_API_URL}/shipments`, payload, { headers: { Authorization: `Bearer ${token}` } })

    // DEMO MODE
    const mockTracking = 'MP' + Date.now().toString().slice(-8)
    return {
      success: true,
      trackingNumber: mockTracking,
      orderId: 'MP-ORD-' + Math.random().toString(36).slice(2, 8).toUpperCase(),
      message: 'Shipment booked with M&P (Demo Mode)'
    }
  } catch (err) {
    return { success: false, message: 'M&P API error' }
  }
}

export const mpTrackShipment = async (trackingNumber) => {
  try {
    // In production:
    // const token = await getMPToken()
    // const res = await axios.get(`${MP_API_URL}/shipments/${trackingNumber}/track`, { headers: { Authorization: `Bearer ${token}` } })

    // DEMO MODE
    return {
      success: true,
      data: {
        trackingNumber,
        status: 'Delivered',
        currentLocation: 'Islamabad',
        deliveredAt: new Date().toLocaleDateString('en-PK'),
        history: [
          { status: 'Booked', location: 'Rawalpindi', time: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString() },
          { status: 'In Transit', location: 'Islamabad Hub', time: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
          { status: 'Out for Delivery', location: 'Islamabad', time: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString() },
          { status: 'Delivered', location: 'Islamabad', time: new Date().toISOString() },
        ]
      }
    }
  } catch (err) {
    return { success: false, message: 'Tracking failed' }
  }
}
