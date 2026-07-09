import { useState } from 'react'
import { Calculator, Package, MapPin, TrendingDown, CheckCircle } from 'lucide-react'

const CITIES = [
  'Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad',
  'Multan', 'Peshawar', 'Quetta', 'Sialkot', 'Gujranwala',
  'Hyderabad', 'Sukkur', 'Bahawalpur', 'Sargodha', 'Abbottabad'
]

// Mock rate calculation based on weight and distance
const calculateRates = (weight, fromCity, toCity, codAmount) => {
  const w = parseFloat(weight) || 0.5
  const cod = parseFloat(codAmount) || 0

  // Base rates per kg
  const baseRates = { tcs: 180, leopards: 160, mp: 150 }
  
  // Same city discount
  const sameCity = fromCity === toCity
  const cityMultiplier = sameCity ? 0.7 : 1

  // COD charges (1.5% of COD amount, min 50)
  const codCharge = cod > 0 ? Math.max(50, cod * 0.015) : 0

  return [
    {
      id: 'tcs',
      name: 'TCS Express',
      color: '#E31837',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      delivery: sameCity ? 'Same Day' : 'Next Day',
      rate: Math.round((baseRates.tcs * w * cityMultiplier) + codCharge),
      codCharge: Math.round(codCharge),
      features: ['Same Day Available', 'Live Tracking', '800+ Cities'],
      recommended: false,
    },
    {
      id: 'leopards',
      name: 'Leopards Courier',
      color: '#FF6B00',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      delivery: sameCity ? 'Same Day' : '1-2 Days',
      rate: Math.round((baseRates.leopards * w * cityMultiplier) + codCharge),
      codCharge: Math.round(codCharge),
      features: ['COD Available', 'Return Management', '650+ Cities'],
      recommended: true,
    },
    {
      id: 'mp',
      name: 'M&P Express',
      color: '#1E3A8A',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      delivery: sameCity ? 'Next Day' : '2-3 Days',
      rate: Math.round((baseRates.mp * w * cityMultiplier) + codCharge),
      codCharge: Math.round(codCharge),
      features: ['Express Delivery', 'SMS Alerts', '400+ Cities'],
      recommended: false,
    }
  ].sort((a, b) => a.rate - b.rate)
}

export default function RateCalculatorPage() {
  const [form, setForm] = useState({
    fromCity: 'Karachi',
    toCity: 'Lahore',
    weight: '0.5',
    codAmount: '0',
  })
  const [rates, setRates] = useState(null)
  const [calculated, setCalculated] = useState(false)

  const handleCalculate = (e) => {
    e.preventDefault()
    const result = calculateRates(form.weight, form.fromCity, form.toCity, form.codAmount)
    setRates(result)
    setCalculated(true)
  }

  const cheapest = rates?.[0]

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Calculator className="w-6 h-6 text-blue-600" /> Rate Calculator
        </h1>
        <p className="text-gray-500 text-sm mt-1">Compare shipping rates across TCS, Leopards, and M&P</p>
      </div>

      {/* Form */}
      <form onSubmit={handleCalculate} className="card p-6">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              <MapPin className="w-3.5 h-3.5 inline mr-1" /> From City
            </label>
            <select className="input" value={form.fromCity} onChange={e => setForm({ ...form, fromCity: e.target.value })}>
              {CITIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              <MapPin className="w-3.5 h-3.5 inline mr-1" /> To City
            </label>
            <select className="input" value={form.toCity} onChange={e => setForm({ ...form, toCity: e.target.value })}>
              {CITIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              <Package className="w-3.5 h-3.5 inline mr-1" /> Weight (kg)
            </label>
            <input type="number" className="input" min="0.1" step="0.1" value={form.weight}
              onChange={e => setForm({ ...form, weight: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              COD Amount (PKR)
            </label>
            <input type="number" className="input" min="0" value={form.codAmount}
              onChange={e => setForm({ ...form, codAmount: e.target.value })} />
          </div>
        </div>
        <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
          <Calculator className="w-4 h-4" /> Calculate Rates
        </button>
      </form>

      {/* Results */}
      {calculated && rates && (
        <div className="space-y-4">
          {/* Best deal banner */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
            <TrendingDown className="w-5 h-5 text-green-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-green-800">Best Rate: {cheapest.name}</p>
              <p className="text-sm text-green-600">Save Rs {rates[rates.length-1].rate - cheapest.rate} compared to most expensive option</p>
            </div>
            <p className="ml-auto text-2xl font-bold text-green-700">Rs {cheapest.rate}</p>
          </div>

          {/* Rate cards */}
          {rates.map((courier, i) => (
            <div key={courier.id} className={`card p-5 border-2 ${i === 0 ? courier.borderColor : 'border-gray-100 dark:border-gray-700'}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${courier.bgColor} rounded-xl flex items-center justify-center text-lg font-bold`}
                    style={{ color: courier.color }}>
                    {i + 1}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">{courier.name}</p>
                    <p className="text-sm text-gray-500">Estimated: {courier.delivery}</p>
                  </div>
                  {i === 0 && (
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium">Cheapest</span>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold" style={{ color: courier.color }}>
                    Rs {courier.rate.toLocaleString('en-PK')}
                  </p>
                  {courier.codCharge > 0 && (
                    <p className="text-xs text-gray-400">incl. COD fee Rs {courier.codCharge}</p>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {courier.features.map(f => (
                  <span key={f} className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded-full">
                    <CheckCircle className="w-3 h-3 text-green-500" /> {f}
                  </span>
                ))}
              </div>
            </div>
          ))}

          <p className="text-xs text-gray-400 text-center">
            * Rates are estimates. Actual rates may vary based on courier policies and fuel surcharges.
          </p>
        </div>
      )}
    </div>
  )
}
