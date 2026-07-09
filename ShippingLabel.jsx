import { Printer } from 'lucide-react'

export default function ShippingLabel({ order, onClose }) {
  const handlePrint = () => {
    window.print()
  }

  const COURIER_NAMES = { tcs: 'TCS Express', leopards: 'Leopards Courier', mp: 'M&P Express' }
  const COURIER_COLORS = { tcs: '#E31837', leopards: '#FF6B00', mp: '#1E3A8A' }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
        {/* Actions */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 print:hidden">
          <h2 className="font-bold text-gray-900">Shipping Label</h2>
          <div className="flex gap-2">
            <button onClick={handlePrint} className="btn-primary flex items-center gap-2 text-sm py-1.5">
              <Printer className="w-4 h-4" /> Print
            </button>
            <button onClick={onClose} className="btn-secondary text-sm py-1.5">Close</button>
          </div>
        </div>

        {/* Label */}
        <div id="shipping-label" className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4 pb-4 border-b-2 border-gray-900">
            <div>
              <p className="font-black text-2xl text-gray-900">CourierHub</p>
              <p className="text-xs text-gray-500">Powered by MERN Stack</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-sm" style={{ color: COURIER_COLORS[order.courier] }}>
                {COURIER_NAMES[order.courier]}
              </p>
              <p className="text-xs text-gray-400">Express Delivery</p>
            </div>
          </div>

          {/* Tracking Number */}
          <div className="bg-gray-900 text-white rounded-lg p-3 mb-4 text-center">
            <p className="text-xs text-gray-400 mb-1">TRACKING NUMBER</p>
            <p className="font-mono font-bold text-xl tracking-widest">{order.trackingNumber}</p>
          </div>

          {/* Barcode simulation */}
          <div className="flex justify-center mb-4">
            <div className="flex gap-0.5 items-end h-12">
              {order.trackingNumber?.split('').map((char, i) => (
                <div key={i} className="bg-gray-900"
                  style={{ width: '3px', height: `${((char.charCodeAt(0) % 8) + 4) * 4}px` }} />
              ))}
            </div>
          </div>

          {/* Addresses */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="border border-gray-200 rounded-lg p-3">
              <p className="text-xs font-bold text-gray-400 uppercase mb-1">From</p>
              <p className="font-semibold text-sm text-gray-900">{order.user?.name || 'Sender'}</p>
              <p className="text-xs text-gray-500">{order.user?.company || 'CourierHub'}</p>
              <p className="text-xs text-gray-500">{order.user?.phone || ''}</p>
            </div>
            <div className="border-2 border-gray-900 rounded-lg p-3">
              <p className="text-xs font-bold text-gray-400 uppercase mb-1">To</p>
              <p className="font-bold text-sm text-gray-900">{order.consigneeName}</p>
              <p className="text-xs text-gray-600">{order.consigneeAddress}</p>
              <p className="text-xs font-semibold text-gray-900">{order.consigneeCity}</p>
              <p className="text-xs text-gray-500">{order.consigneePhone}</p>
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-3 gap-2 mb-4 text-center">
            <div className="bg-gray-50 rounded-lg p-2">
              <p className="text-xs text-gray-400">Weight</p>
              <p className="font-bold text-sm">{order.weight} kg</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-2">
              <p className="text-xs text-gray-400">Pieces</p>
              <p className="font-bold text-sm">{order.pieces}</p>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2">
              <p className="text-xs text-gray-400">COD</p>
              <p className="font-bold text-sm text-yellow-700">Rs {order.codAmount?.toLocaleString('en-PK')}</p>
            </div>
          </div>

          {/* Description */}
          <div className="border border-gray-200 rounded-lg p-3 mb-4">
            <p className="text-xs text-gray-400 mb-1">Contents</p>
            <p className="text-sm text-gray-700">{order.description}</p>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-gray-400 border-t border-gray-100 pt-3">
            <p>Booked: {new Date(order.createdAt).toLocaleDateString('en-PK', { timeZone: 'Asia/Karachi' })}</p>
            <p className="mt-0.5">Handle with care • CourierHub Pakistan</p>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          body > * { display: none !important; }
          #shipping-label { display: block !important; }
          .fixed { position: static !important; background: none !important; }
          .bg-white { box-shadow: none !important; }
        }
      `}</style>
    </div>
  )
}
