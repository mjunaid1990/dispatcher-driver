Build a Delivery Management Platform (Mobile First + Web)
Backend: Node.js (Express or NestJS) with MongoDB.
Frontend: React Native for mobile apps, React web dashboard.

Build the mobile apps first, then the web dispatcher dashboard.

Phase 1: Mobile Driver App (build first)
Driver signup/login with JWT auth.
Real-time delivery assignments via Socket.IO or WebSocket.
Accept/decline delivery requests.
Pickup and drop-off address details with navigation integration.
Status updates: arrived pickup, picked up, in transit, arrived, delivered, failed.
Proof of delivery: photo upload and signature capture.
Offline support: cache active deliveries and sync on reconnect.
Push notifications for new orders.
Earnings and trip history.

Phase 2: Mobile Customer App
Customer signup/login.
Place delivery request with pickup and drop-off addresses.
Real-time tracking of assigned driver and ETA.
Live order status updates.
Order history, reorder, and receipts.
In-app chat or call with driver.
Rating and feedback after delivery.

Phase 3: Web Dispatcher Dashboard
Admin/dispatcher login with role-based access.
Live map of all active drivers.
Create, assign, and reassign deliveries.
Driver status and availability management.
Route optimization and batching.
Customer and driver management.
Order history and delivery analytics.
SMS/email/push notification settings.
Backend API (Node.js + MongoDB)
REST API and WebSocket for real-time updates.
MongoDB collections: users, drivers, customers, orders, deliveries, stops, notifications, reviews, payments.
JWT authentication and role-based access control.
File storage for proof-of-delivery photos (AWS S3, Cloudinary, or local).
Push notification service via Firebase Cloud Messaging.
Optional: Redis for caching and driver location tracking.
Shared Features
Real-time driver tracking.
Auto/manual dispatch.
Delivery status lifecycle.
Notifications (push, SMS, email).
Ratings and reviews.
Analytics and reporting.

Design
Mobile-first, clean, and modern UI.
Consistent design system across all apps.
Maps integration for tracking and navigation.


MongoDB Schema — Delivery Platform
users

{ _id, name, email (unique), phone, passwordHash,
  role: ['admin','dispatcher','driver','customer'],
  avatarUrl, isActive: Boolean, fcmTokens: [String],
  createdAt, updatedAt }
drivers (1:1 with users where role=driver)

{ _id, userId: ObjectId→users (unique),
  vehicle: { type: ['bike','scooter','car','van'], plate, model, color },
  license: { number, expiryAt, docUrl },
  status: ['offline','online','busy'],
  currentLocation: { type:'Point', coordinates:[lng,lat] },  // 2dsphere index
  lastLocationAt, rating: Number, totalDeliveries: Number,
  earningsBalance: Number, isVerified: Boolean }
customers

{ _id, userId: ObjectId→users, defaultAddressId, savedAddresses: [ObjectId→addresses] }
addresses

{ _id, ownerId: ObjectId→users, label, line1, line2, city, state, postalCode, country,
  location: { type:'Point', coordinates:[lng,lat] },  // 2dsphere
  contactName, contactPhone, instructions }
orders

{ _id, orderNumber (unique), customerId→users, businessId→businesses,
  pickup:  { addressId, contactName, contactPhone, location, scheduledAt },
  dropoff: { addressId, contactName, contactPhone, location, scheduledAt },
  items: [{ name, qty, weightKg, notes }],
  packageSize: ['small','medium','large'], codAmount: Number,
  status: ['pending','assigned','accepted','picked_up','in_transit','delivered','failed','cancelled'],
  priority: ['normal','express'],
  pricing: { base, distanceFee, surge, tip, total, currency },
  distanceKm, estimatedDurationMin, etaAt,
  assignedDriverId→drivers, assignedAt, deliveredAt,
  failureReason, cancelledBy, createdAt, updatedAt }
Indexes: {status,createdAt}, {assignedDriverId,status}, {customerId}, geo on pickup/dropoff.

deliveryAssignments (offer/accept audit)

{ _id, orderId, driverId, offeredAt, respondedAt,
  response: ['pending','accepted','rejected','expired'], expiresAt, rejectReason }
trackingEvents (append-only status timeline)

{ _id, orderId, driverId, status, location:{type:'Point',coordinates}, note, createdAt }
locationPings (time-series / TTL)

{ _id, driverId, orderId?, location:{type:'Point',coordinates},
  speedKph, heading, batteryPct, recordedAt }  // TTL index ~30 days
proofOfDelivery

{ _id, orderId (unique), driverId, photoUrls: [String],
  signatureUrl, receiverName, otpVerified: Boolean,
  location, capturedAt }
routes (optimized multi-stop)

{ _id, driverId, date, stops: [{ orderId, type:['pickup','dropoff'], seq, etaAt, completedAt }],
  totalDistanceKm, totalDurationMin, status:['planned','active','completed'] }
earnings

{ _id, driverId, orderId, type:['delivery','tip','bonus','adjustment'],
  amount, currency, periodStart, periodEnd,
  payoutId→payouts, status:['pending','paid'], createdAt }
payouts

{ _id, driverId, amount, currency, method, reference,
  status:['pending','processing','paid','failed'], periodStart, periodEnd, paidAt }
businesses (merchants sending orders)

{ _id, name, ownerUserId, phone, email, addressId, apiKeyHash, isActive }
ratings

{ _id, orderId, raterId→users, rateeId→users, role:['driver','customer'],
  stars: 1..5, comment, createdAt }
notifications

{ _id, userId, type, title, body, data: Mixed, readAt, sentAt }
supportTickets

{ _id, orderId?, openedBy→users, subject, category,
  status:['open','in_progress','resolved'], priority,
  messages: [{ senderId, text, attachments, sentAt }], resolvedAt }
settings / zones

{ _id, name, polygon: { type:'Polygon', coordinates:[[[lng,lat],...]] },
  baseFare, perKmRate, surgeMultiplier, isActive }
Key relationships
users 1—1 drivers / customers
orders N—1 customers, N—1 drivers, 1—N trackingEvents, 1—1 proofOfDelivery
drivers 1—N earnings → N—1 payouts
zones used for pricing + dispatch filtering via $geoWithin