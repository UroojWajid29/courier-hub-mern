import { useState, useEffect } from 'react'
import axios from 'axios'

export default function AdminCouriers() {
  const [couriers, setCouriers] = useState([])

  useEffect(() => {
    axios.get('/api/couriers').then(({ data }) => setCouriers(data.couriers || []))
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Courier Management</h1>
        <p className="text-gray-500 text-sm mt-1">Manage courier API integrations</p>
      </div>

      <div className="grid gap-5">
        {couriers.map(courier => (
          <div key={courier.id} className="card p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                  style={{ backgroundColor: courier.color + '15' }}>
                  {courier.id === 'tcs' ? '🔴' : courier.id === 'leopards' ? '🟠' : '🔵'}
                </div>
                <div>
                  <h2 className="font-bold text-gray-900">{courier.name}</h2>
                  <p className="text-sm text-gray-500">{courier.description}</p>
                  <p className="text-sm font-medium mt-1" style={{ color: courier.color }}>{courier.cities}+ cities</p>
                </div>
              </div>
              <div className="flex gap-2">
                <a href={courier.website} target="_blank" rel="noopener noreferrer" className="btn-primary text-sm py-1.5 px-4">
                  Visit Site →
                </a>
                <a href={courier.apiDocs} target="_blank" rel="noopener noreferrer" className="btn-secondary text-sm py-1.5 px-4">
                  API Docs
                </a>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {courier.features.map(f => (
                <span key={f} className="badge bg-gray-100 text-gray-600">✓ {f}</span>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase">API Status</p>
                  <p className="text-sm font-medium text-yellow-600 mt-0.5">⚠️ Demo Mode — Add API key to .env to go live</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-gray-400 uppercase">Tracking URL</p>
                  <a href={courier.trackingUrl} target="_blank" rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    {courier.trackingUrl}
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
        <p className="font-semibold text-blue-800 mb-2">🔌 How to Enable Live Mode</p>
        <div className="text-sm text-blue-700 space-y-1">
          <p>• Get API credentials from each courier's developer portal</p>
          <p>• Add keys to <code className="bg-blue-100 px-1 rounded">backend/.env</code></p>
          <p>• Uncomment the real API calls in <code className="bg-blue-100 px-1 rounded">backend/config/tcs.service.js</code> etc.</p>
          <p>• Restart the backend server</p>
        </div>
      </div>
    </div>
  )
}
