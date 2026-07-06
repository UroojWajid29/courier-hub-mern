// Courier company info and links
export const getCouriers = (req, res) => {
  const couriers = [
    {
      id: 'tcs',
      name: 'TCS Express',
      logo: 'https://www.tcsexpress.com/images/tcs-logo.png',
      website: 'https://www.tcsexpress.com',
      trackingUrl: 'https://www.tcsexpress.com/track',
      color: '#E31837',
      description: 'Pakistan\'s leading courier service with nationwide coverage',
      cities: 800,
      apiDocs: 'https://developer.tcsexpress.com',
      features: ['Same Day Delivery', 'COD', 'Live Tracking', 'Bulk Booking']
    },
    {
      id: 'leopards',
      name: 'Leopards Courier',
      logo: 'https://www.leopardscourier.com/images/logo.png',
      website: 'https://www.leopardscourier.com',
      trackingUrl: 'https://www.leopardscourier.com/leopards-courier/track-your-packet',
      color: '#FF6B00',
      description: 'Fastest growing courier network across Pakistan',
      cities: 650,
      apiDocs: 'https://voip.leopardscourier.com/api',
      features: ['Next Day Delivery', 'COD', 'Real-time Tracking', 'Return Management']
    },
    {
  id: 'mp',
  name: 'M&P Express',
  website: 'https://www.mulphilog.com',
  trackingUrl: 'https://mulphilog.com.pk/track-shipment.php',
  color: '#1E3A8A',
  description: 'Reliable express delivery across major Pakistani cities',
  cities: 400,
  apiDocs: 'https://www.mulphilog.com',
  features: ['Express Delivery', 'COD', 'SMS Alerts', 'E-commerce Integration']
},
  ]
  res.json({ success: true, couriers })
}

// Get Pakistani cities list
export const getCities = (req, res) => {
  const cities = [
    'Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad',
    'Multan', 'Peshawar', 'Quetta', 'Sialkot', 'Gujranwala',
    'Hyderabad', 'Sukkur', 'Larkana', 'Bahawalpur', 'Sargodha',
    'Abbottabad', 'Mardan', 'Mingora', 'Rahim Yar Khan', 'Sahiwal'
  ]
  res.json({ success: true, cities })
}
