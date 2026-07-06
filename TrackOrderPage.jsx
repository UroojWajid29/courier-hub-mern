import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'

const STATUS_ICONS = {
  Booked: '📋', 'In Transit': '🚚', 'Out for Delivery': '🏃', Delivered: '✅', Returned: '↩️'
}

export default function TrackOrderPage() {
  const [params] = useSearchParams()
  const [trackingNumber, setTrackingNumber] = useState(params.get('t') || '')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (params.get('t')) handleTrack()
  }, [])

  const handleTrack = async (e) => {
    e?.preventDefault()
    if (!trackingNumber.trim()) return toast.error('Enter a tracking number!')
    setLoading(true)
    try {
      const { data } = await axios.get(`/api/orders/track/${trackingNumber}`)
      if (data.success) setResult(data)
      else toast.error('Order not found.')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Tracking failed.')
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  const COURIER_NAMES = { tcs: 'TCS Express', leopards: 'Leopards Courier', mp: 'M&P Express' }
  const STATUS_COLORS = {
    pending: 'bg-yellow-100 text-yellow-700', booked: 'bg-blue-100 text-blue-700',
    in_transit: 'bg-purple-100 text-purple-700', delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700', out_for_delivery: 'bg-orange-100 text-orange-700',
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Track Order</h1>
        <p className="text-gray-500 text-sm mt-1">Enter your tracking number to get live status</p>
      </div>

      {/* Search */}
      <form onSubmit={handleTrack} className="flex gap-3">
        <input
          className="input flex-1 font-mono"
          placeholder="e.g. TCS12345678"
          value={trackingNumber}
          onChange={e => setTrackingNumber(e.target.value)}
        />
        <button type="submit" disabled={loading} className="btn-primary px-6">
          {loading ? '...' : '🔍 Track'}
        </button>
      </form>

      {/* Result */}
      {result && (
        <div className="space-y-4">
          {/* Order Info */}
          <div className="card p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="font-mono text-lg font-bold text-blue-600">{result.order.trackingNumber}</p>
                <p className="text-sm text-gray-500 mt-0.5">{COURIER_NAMES[result.order.courier]}</p>
              </div>
              <span className={`badge ${STATUS_COLORS[result.order.status] || 'bg-gray-100 text-gray-700'} text-sm px-3 py-1`}>
                {result.order.status?.replace('_', ' ')}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400 text-xs uppercase font-medium mb-1">Receiver</p>
                <p className="font-medium text-gray-900">{result.order.consigneeName}</p>
                <p className="text-gray-500">{result.order.consigneePhone}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs uppercase font-medium mb-1">Delivery Address</p>
                <p className="font-medium text-gray-900">{result.order.consigneeCity}</p>
                <p className="text-gray-500 text-xs">{result.order.consigneeAddress}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs uppercase font-medium mb-1">COD Amount</p>
                <p className="font-bold text-gray-900">Rs {result.order.codAmount?.toLocaleString('en-PK')}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs uppercase font-medium mb-1">Booked On</p>
                <p className="font-medium text-gray-900">
                  {new Date(result.order.createdAt).toLocaleDateString('en-PK', { timeZone: 'Asia/Karachi' })}
                </p>
              </div>
            </div>
          </div>

          {/* Tracking Timeline */}
          {result.order.trackingHistory?.length > 0 && (
            <div className="card p-5">
              <h2 className="font-semibold text-gray-900 mb-4">Tracking History</h2>
              <div className="space-y-4">
                {[...result.order.trackingHistory].reverse().map((event, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${i === 0 ? 'bg-blue-100' : 'bg-gray-100'}`}>
                        {STATUS_ICONS[event.status] || '📍'}
                      </div>
                      {i < result.order.trackingHistory.length - 1 && (
                        <div className="w-px h-full bg-gray-200 mt-1 min-h-4" />
                      )}
                    </div>
                    <div className="pb-4 flex-1">
                      <p className={`font-medium text-sm ${i === 0 ? 'text-blue-700' : 'text-gray-700'}`}>{event.status}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {event.location} · {new Date(event.timestamp).toLocaleString('en-PK', { timeZone: 'Asia/Karachi' })} PKT
                      </p>
                      {event.description && <p className="text-xs text-gray-500 mt-0.5">{event.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Live tracking link */}
          <div className="card p-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">Track directly on {COURIER_NAMES[result.order.courier]}'s website</p>
            <a
              href={result.order.courier === 'tcs' ? `https://www.tcsexpress.com/track/?tn=${result.order.trackingNumber}` :
                result.order.courier === 'leopards' ? `https://www.leopardscourier.com/leopards-courier/track-your-packet/?track_no=${result.order.trackingNumber}` :
                `https://mulphilog.com.pk/track-shipment.php?tracking=${result.order.trackingNumber}`}
              target="_blank" rel="noopener noreferrer"
              className="btn-secondary text-sm py-1.5 px-3"
            >
              Open Courier Site →
            </a>
          </div>
        </div>
      )}

      {/* Tip when empty */}
      {!result && !loading && (
        <div className="card p-8 text-center text-gray-400">
          <p className="text-5xl mb-3">🔍</p>
          <p className="font-medium">Enter a tracking number above</p>
          <p className="text-sm mt-1">You can find it in your Orders list</p>
        </div>
      )}
    </div>
  )
}
