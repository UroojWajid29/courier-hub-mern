---

## 👥 Role-Based Access

| Feature | User | Admin |
|---|---|---|
| Book shipments | ✅ | ✅ |
| Track own orders | ✅ | ✅ |
| View ALL orders | ❌ | ✅ |
| Update any order status | ❌ | ✅ |
| View all users | ❌ | ✅ |
| Delete users | ❌ | ✅ |
| Manage couriers | ❌ | ✅ |

---

## 🔌 Courier API Integration

Currently runs in Demo Mode. To go live get API keys from:

- TCS: https://developer.tcsexpress.com
- Leopards: https://leopardscourier.com
- M&P: https://mulphilog.com.pk

---

## 📡 API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /api/auth/register | Public | Register user |
| POST | /api/auth/login | Public | Login |
| GET | /api/auth/me | JWT | Get current user |
| POST | /api/auth/forgot-password/verify | Public | Verify email |
| POST | /api/auth/forgot-password/reset | Public | Reset password |
| POST | /api/orders | JWT | Book shipment |
| GET | /api/orders | JWT | Get my orders |
| GET | /api/orders/track/:id | JWT | Track order |
| PUT | /api/orders/:id/cancel | JWT | Cancel order |
| GET | /api/dashboard/stats | JWT | Dashboard stats |
| GET | /api/couriers | Public | List couriers |
| GET | /api/admin/stats | Admin | Platform stats |
| GET | /api/admin/orders | Admin | All orders |
| GET | /api/admin/users | Admin | All users |
| DELETE | /api/admin/users/:id | Admin | Delete user |

---

## 🇵🇰 Pakistani Market Features

- PKR currency formatting throughout
- 20+ Pakistani cities in all dropdowns
- COD (Cash on Delivery) support
- Direct links to TCS, Leopards, M&P websites
- PKT (UTC+5) timezone on all timestamps

---

## 👩‍💻 Author

**Urooj Fatima**
- GitHub: [@UroojWajid29](https://github.com/UroojWajid29)
- University: Air University, Islamabad

---

## 📄 License

MIT License
