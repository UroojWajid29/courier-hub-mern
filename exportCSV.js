export const exportOrdersToCSV = (orders) => {
  const headers = [
    'Tracking Number', 'Consignee Name', 'Phone', 'Address', 'City',
    'Courier', 'Weight (kg)', 'Pieces', 'COD Amount (PKR)',
    'Status', 'Payment Status', 'Description', 'Booked Date'
  ]

  const rows = orders.map(o => [
    o.trackingNumber || '',
    o.consigneeName || '',
    o.consigneePhone || '',
    o.consigneeAddress || '',
    o.consigneeCity || '',
    o.courier?.toUpperCase() || '',
    o.weight || '',
    o.pieces || '',
    o.codAmount || 0,
    o.status?.replace(/_/g, ' ') || '',
    o.paymentStatus || '',
    o.description || '',
    new Date(o.createdAt).toLocaleDateString('en-PK', { timeZone: 'Asia/Karachi' })
  ])

  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `orders_${new Date().toISOString().split('T')[0]}.csv`
  link.click()
  URL.revokeObjectURL(url)
}
