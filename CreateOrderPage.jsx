import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'

const COURIERS = [
  { id: 'tcs', name: 'TCS Express', color: '#E31837', emoji: '🔴', features: 'Same Day • 800+ Cities' },
  { id: 'leopards', name: 'Leopards Courier', color: '#FF6B00', emoji: '🟠', features: 'Next Day • 650+ Cities' },
  { id: 'mp', name: 'M&P Express', color: '#1E3A8A', emoji: '🔵', features: 'Express • 400+ Cities' },
]

export default function CreateOrderPage() {
  const navigate = useNavigate()
  const [cities, setCities] = useState([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    consigneeName: '',
    consigneePhone: '',
    consigneeAddress: '',
    consigneeCity: '',
    description: '',
    weight: '0.5',
    pieces: '1',
    codAmount: '0',
    courier: '',
  })

  useEffect(() => {
    axios.get('/api/couriers/cities').then(({ data }) => setCities(data.cities || []))
  }, [])

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.courier) return toast.error('Please select a courier!')
    setLoading(true)
    try {
      const { data } = await axios.post('/api/orders', {
        ...form,
        weight: Number(form.weight),
        pieces: Number(form.pieces),
        codAmount: Number(form.codAmount),
      })
      if (data.success) {
        toast.success(`Order booked! Tracking: ${data.tracking}`)
        navigate('/orders')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">New Shipment</h1>
        <p className="text-gray-500 text-sm mt-1">Book a new shipment with TCS, Leopards, or M&P</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Courier Selection */}
        <div className="card p-5">
          <h2 className="font-semibold text-gray-900 mb-3">1. Select Courier</h2>
          <div className="grid grid-cols-3 gap-3">
            {COURIERS.map(c => (
              <button
                key={c.id}
                type="button"
                onClick={() => set('courier', c.id)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  form.courier === c.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <p className="text-2xl mb-1">{c.emoji}</p>
                <p className="font-semibold text-sm text-gray-900">{c.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{c.features}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Consignee Info */}
        <div className="card p-5">
          <h2 className="font-semibold text-gray-900 mb-4">2. Receiver Details</h2>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input className="input" placeholder="Ahmed Khan" value={form.consigneeName}
                  onChange={e => set('consigneeName', e.target.value)} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                <input className="input" placeholder="03XX-XXXXXXX" value={form.consigneePhone}
                  onChange={e => set('consigneePhone', e.target.value)} required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
              <input className="input" placeholder="House #, Street, Area" value={form.consigneeAddress}
                onChange={e => set('consigneeAddress', e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
              <select className="input" value={form.consigneeCity} onChange={e => set('consigneeCity', e.target.value)} required>
                <option value="">Select city...</option>
                {cities.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Shipment Details */}
        <div className="card p-5">
          <h2 className="font-semibold text-gray-900 mb-4">3. Shipment Details</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
              <input className="input" placeholder="e.g. Clothing items, Electronics" value={form.description}
                onChange={e => set('description', e.target.value)} required />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                <input type="number" className="input" min="0.1" step="0.1" value={form.weight}
                  onChange={e => set('weight', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pieces</label>
                <input type="number" className="input" min="1" value={form.pieces}
                  onChange={e => set('pieces', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">COD Amount (PKR)</label>
                <input type="number" className="input" min="0" placeholder="0" value={form.codAmount}
                  onChange={e => set('codAmount', e.target.value)} />
              </div>
            </div>
            <p className="text-xs text-gray-400">COD = Cash on Delivery amount the rider will collect</p>
          </div>
        </div>

        {/* Summary */}
        {form.courier && form.consigneeName && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm">
            <p className="font-semibold text-blue-800 mb-2">📋 Order Summary</p>
            <div className="space-y-1 text-blue-700">
              <p>Courier: <strong>{COURIERS.find(c => c.id === form.courier)?.name}</strong></p>
              <p>To: <strong>{form.consigneeName}</strong> — {form.consigneeCity}</p>
              <p>COD: <strong>Rs {Number(form.codAmount).toLocaleString('en-PK')}</strong></p>
            </div>
          </div>
        )}

        <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
          {loading ? '⏳ Booking shipment...' : '🚀 Book Shipment'}
        </button>
      </form>
    </div>
  )
}
