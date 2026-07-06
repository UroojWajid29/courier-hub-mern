import { useState, useEffect } from 'react'
import axios from 'axios'

export default function CouriersPage() {
  const [couriers, setCouriers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('/api/couriers')
      .then(({ data }) => setCouriers(data.couriers || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Courier Partners</h1>
        <p className="text-gray-500 text-sm mt-1">Our integrated courier companies — click any link to visit their website</p>
      </div>

      <div className="grid gap-6">
        {couriers.map(courier => (
          <div key={courier.id} className="card p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl"
                  style={{ backgroundColor: courier.color + '15' }}>
                  {courier.id === 'tcs' ? '🔴' : courier.id === 'leopards' ? '🟠' : '🔵'}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{courier.name}</h2>
                  <p className="text-sm text-gray-500">{courier.description}</p>
                  <p className="text-sm font-medium mt-1" style={{ color: courier.color }}>
                    {courier.cities}+ cities covered
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-2 flex-shrink-0">
                <a href={courier.website} target="_blank" rel="noopener noreferrer"
                  className="btn-primary text-sm py-1.5 px-4 text-center">
                  Visit Website →
                </a>
                <a href={courier.trackingUrl} target="_blank" rel="noopener noreferrer"
                  className="btn-secondary text-sm py-1.5 px-4 text-center">
                  Track Shipment
                </a>
              </div>
            </div>

            {/* Features */}
            <div className="mt-4 flex flex-wrap gap-2">
              {courier.features.map(f => (
                <span key={f} className="badge bg-gray-100 text-gray-600">✓ {f}</span>
              ))}
            </div>

            {/* API Docs Link */}
            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">API Documentation</p>
                <p className="text-sm text-gray-600 mt-0.5">{courier.apiDocs}</p>
              </div>
              <a href={courier.apiDocs} target="_blank" rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View Docs →
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Info box */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
        <p className="font-semibold text-blue-800 mb-2">🔌 How API Integration Works</p>
        <div className="text-sm text-blue-700 space-y-1">
          <p>• Get API credentials from each courier's developer portal</p>
          <p>• Add keys to your backend <code className="bg-blue-100 px-1 rounded">.env</code> file</p>
          <p>• The backend handles all API calls — your frontend just talks to our backend</p>
          <p>• Currently running in <strong>Demo Mode</strong> — replace keys in .env to go live</p>
        </div>
      </div>
    </div>
  )
}
