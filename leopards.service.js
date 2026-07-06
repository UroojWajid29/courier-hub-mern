import axios from 'axios'

const LEOPARDS_API_URL = process.env.LEOPARDS_API_URL || 'https://voip.leopardscourier.com/api'
const LEOPARDS_API_KEY = process.env.LEOPARDS_API_KEY || 'DEMO_KEY'
const LEOPARDS_API_PASSWORD = process.env.LEOPARDS_API_PASSWORD || 'DEMO_PASS'

export const leopardsBookShipment = async (orderData) => {
  try {
    const payload = {
      api_key: LEOPARDS_API_KEY,
      api_password: LEOPARDS_API_PASSWORD,
      booked_packet_weight: orderData.weight,
      booked_packet_no_piece: orderData.pieces,
      booked_packet_collect_amount: orderData.codAmount,
      booked_packet_order_id: 'ORD-' + Date.now(),
      shipment_name_eng: orderData.consigneeName,
      shipment_phone: orderData.consigneePhone,
      shipment_address: orderData.consigneeAddress,
      shipment_city: orderData.consigneeCity,
      shipment_detail: orderData.description,
    }

    // In production:
    // const res = await axios.post(`${LEOPARDS_API_URL}/bookPacket/format/json`, payload)
    // return { success: true, trackingNumber: res.data.track_number }

    // DEMO MODE
    const mockTracking = 'LP' + Date.now().toString().slice(-8)
    return {
      success: true,
      trackingNumber: mockTracking,
      orderId: 'LP-ORD-' + Math.random().toString(36).slice(2, 8).toUpperCase(),
      message: 'Shipment booked with Leopards (Demo Mode)'
    }
  } catch (err) {
    return { success: false, message: err.response?.data?.error || 'Leopards API error' }
  }
}

export const leopardsTrackShipment = async (trackingNumber) => {
  try {
    // In production:
    // const res = await axios.get(`${LEOPARDS_API_URL}/trackBookedPacket/format/json?api_key=${LEOPARDS_API_KEY}&api_password=${LEOPARDS_API_PASSWORD}&track_numbers=${trackingNumber}`)

    // DEMO MODE
    return {
      success: true,
      data: {
        trackingNumber,
        status: 'Out for Delivery',
        currentLocation: 'Lahore City',
        estimatedDelivery: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toLocaleDateString('en-PK'),
        history: [
          { status: 'Booked', location: 'Karachi', time: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
          { status: 'In Transit', location: 'Lahore Hub', time: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() },
          { status: 'Out for Delivery', location: 'Lahore City', time: new Date().toISOString() },
        ]
      }
    }
  } catch (err) {
    return { success: false, message: 'Tracking failed' }
  }
}
