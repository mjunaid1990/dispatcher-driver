const formatCoords = (location) => {
  if (location && Array.isArray(location.coordinates) && location.coordinates.length >= 2) {
    const [lng, lat] = location.coordinates;
    return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  }
  return 'Address unavailable';
};

const formatAddress = (stop) => {
  if (!stop) return 'Address unavailable';
  if (stop.line) return stop.line;
  const coords = formatCoords(stop.location);
  return stop.contactName ? `${stop.contactName} \u00b7 ${coords}` : coords;
};

const getCustomerName = (order = {}) => {
  if (order.customerId && typeof order.customerId === 'object' && order.customerId.name) {
    return order.customerId.name;
  }
  return (
    (order.dropoff && order.dropoff.contactName) ||
    (order.pickup && order.pickup.contactName) ||
    'Customer'
  );
};

export const mapOrderToDelivery = (order = {}) => ({
  id: order._id,
  orderNumber: order.orderNumber || order._id,
  customerName: getCustomerName(order),
  pickupAddress: formatAddress(order.pickup),
  dropoffAddress: formatAddress(order.dropoff),
  pickupContactPhone: (order.pickup && order.pickup.contactPhone) || '',
  dropoffContactPhone: (order.dropoff && order.dropoff.contactPhone) || '',
  status: order.status || 'pending',
  estimatedTime: order.estimatedDurationMin ? `${order.estimatedDurationMin} min` : 'N/A',
  distance: order.distanceKm ? `${order.distanceKm} km` : 'N/A',
  earnings: (order.pricing && order.pricing.total) ?? order.codAmount ?? 0,
  codAmount: order.codAmount || 0,
  priority: order.priority || 'normal',
  items: order.items || [],
  order,
});

export const mapAssignmentToDelivery = (assignment = {}) => {
  const order =
    assignment.orderId && typeof assignment.orderId === 'object' ? assignment.orderId : {};
  return {
    ...mapOrderToDelivery(order),
    assignmentId: assignment._id,
    assignmentResponse: assignment.response,
  };
};

export const ACTIVE_STATUSES = ['assigned', 'accepted', 'picked_up', 'in_transit'];

const getDriver = (order = {}) => {
  const driver = order.assignedDriverId;
  if (driver && typeof driver === 'object') {
    const userId = driver.userId && typeof driver.userId === 'object' ? driver.userId : {};
    return {
      name: userId.name || driver.name || 'Driver',
      phone: userId.phone || '',
      rating: driver.rating || 0,
    };
  }
  return { name: 'Driver', phone: '', rating: 0 };
};

export const mapOrderToCustomer = (order = {}) => ({
  id: order._id,
  orderNumber: order.orderNumber || order._id,
  status: order.status || 'pending',
  priority: order.priority || 'normal',
  packageSize: order.packageSize || 'medium',
  codAmount: order.codAmount || 0,
  items: order.items || [],
  pickup: order.pickup || {},
  dropoff: order.dropoff || {},
  pickupAddress: formatAddress(order.pickup),
  dropoffAddress: formatAddress(order.dropoff),
  pricing: order.pricing || {},
  total: (order.pricing && order.pricing.total) || order.codAmount || 0,
  currency: (order.pricing && order.pricing.currency) || 'USD',
  distanceKm: order.distanceKm || 0,
  estimatedDurationMin: order.estimatedDurationMin || 0,
  etaAt: order.etaAt || null,
  deliveredAt: order.deliveredAt || null,
  driver: getDriver(order),
  createdAt: order.createdAt,
  order,
});
