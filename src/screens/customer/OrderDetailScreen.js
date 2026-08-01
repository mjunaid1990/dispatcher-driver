import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography, elevation } from '../../theme/theme';
import ScreenHeader from '../../components/ScreenHeader';
import StatusPill from '../../components/StatusPill';
import Button from '../../components/Button';
import api from '../../api/client';
import { mapOrderToCustomer } from '../../api/mappers';
import { showAlert, confirmAction } from '../../utils/alerts';

const eventLabels = {
  pending: 'Order Placed',
  assigned: 'Driver Assigned',
  accepted: 'Driver Accepted',
  picked_up: 'Package Picked Up',
  in_transit: 'Out for Delivery',
  delivered: 'Delivered',
  failed: 'Delivery Failed',
  cancelled: 'Order Cancelled',
};

const OrderDetailScreen = ({ route }) => {
  const navigation = useNavigation();
  const { userInfo } = useAuth();
  const { orderId } = route.params || {};
  const [order, setOrder] = useState(null);
  const [events, setEvents] = useState([]);
  const [rated, setRated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData(true);
    setRefreshing(false);
  }, [loadData]);

  const loadData = useCallback(async (silent = false) => {
    if (!orderId) return;
    try {
      const [orderRes, eventsRes, ratingsRes] = await Promise.all([
        api.get(`/orders/${orderId}`),
        api.get('/tracking/events', { params: { orderId } }),
        api.get('/ratings', { params: { orderId } }),
      ]);
      setOrder(mapOrderToCustomer(orderRes.data));
      setEvents((eventsRes.data || []).slice().reverse());
      setRated((ratingsRes.data || []).length > 0);
    } catch (error) {
      if (!silent) {
        showAlert('Error', error.response?.data?.message || 'Failed to load order');
      }
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useFocusEffect(
    useCallback(() => {
      loadData();
      const interval = setInterval(() => loadData(true), 5000);
      return () => clearInterval(interval);
    }, [loadData])
  );

  const handleCallDriver = () => {
    const phone = order?.driver?.phone;
    if (!phone) {
      showAlert('Info', 'No driver phone number available yet');
      return;
    }
    Linking.openURL(`tel:${phone}`).catch(() =>
      showAlert('Error', 'Could not open phone dialer')
    );
  };

  const handleCancel = () => {
    confirmAction(
      'Cancel Order',
      `Cancel ${order.orderNumber}?`,
      async () => {
        try {
          await api.put(`/orders/${order.id}`, { status: 'cancelled' });
          showAlert('Success', 'Order cancelled');
          loadData();
        } catch (error) {
          showAlert('Error', error.response?.data?.message || 'Failed to cancel order');
        }
      },
      { confirmText: 'Cancel Order', destructive: true }
    );
  };

  const handleReorder = () => {
    confirmAction(
      'Reorder',
      `Place a new order matching ${order.orderNumber}?`,
      async () => {
        try {
          const src = order.order;
          const payload = {
            orderNumber: `ORD-${Date.now()}`,
            customerId: userInfo._id,
            pickup: src.pickup,
            dropoff: src.dropoff,
            items: src.items || [],
            packageSize: src.packageSize || 'medium',
            codAmount: src.codAmount || 0,
            priority: src.priority || 'normal',
            pricing: src.pricing,
            status: 'pending',
          };
          const res = await api.post('/orders', payload);
          showAlert('Success', `New order ${res.data.orderNumber} placed`);
          navigation.replace('OrderDetail', { orderId: res.data._id });
        } catch (error) {
          showAlert('Error', error.response?.data?.message || 'Failed to reorder');
        }
      },
      { confirmText: 'Reorder' }
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.mint} />
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.center}>
        <Text style={styles.empty}>Order not found</Text>
      </View>
    );
  }

  const pricing = order.pricing || {};
  const itemsSummary = (order.items || []).map((i) => `${i.qty || 1}x ${i.name}`).join(', ');

  return (
    <View style={styles.container}>
      <ScreenHeader title="Order Details" />
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.mint} />}
      >
        <View style={styles.topCard}>
          <View style={styles.topRow}>
            <Text style={styles.orderNumber}>{order.orderNumber}</Text>
            <StatusPill status={order.status} size="md" />
          </View>
          <Text style={styles.date}>{new Date(order.createdAt).toLocaleString()}</Text>

          <View style={styles.statusBlock}>
            <Text style={styles.sectionTitle}>Status Timeline</Text>
            {events.length === 0 && (
              <Text style={styles.muted}>Waiting for a driver to accept your order</Text>
            )}
            {events.map((event, index) => (
              <View key={index} style={styles.timelineRow}>
                <View style={[styles.timelineDot, index === 0 && styles.timelineDotLatest]} />
                {index < events.length - 1 && <View style={styles.timelineLine} />}
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineLabel}>
                    {eventLabels[event.status] || event.status}
                  </Text>
                  <Text style={styles.timelineTime}>
                    {new Date(event.createdAt).toLocaleString()}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Route</Text>
          <View style={styles.routeRow}>
            <Ionicons name="arrow-up-circle" size={18} color={colors.mint} style={styles.routeIcon} />
            <View style={styles.routeText}>
              <Text style={styles.routeLabel}>Pickup</Text>
              <Text style={styles.routeValue}>{order.pickupAddress}</Text>
              {!!order.pickup.contactName && (
                <Text style={styles.routeContact}>{order.pickup.contactName}{order.pickup.contactPhone ? ` · ${order.pickup.contactPhone}` : ''}</Text>
              )}
            </View>
          </View>
          <View style={styles.routeRow}>
            <Ionicons name="arrow-down-circle" size={18} color={colors.error} style={styles.routeIcon} />
            <View style={styles.routeText}>
              <Text style={styles.routeLabel}>Drop-off</Text>
              <Text style={styles.routeValue}>{order.dropoffAddress}</Text>
              {!!order.dropoff.contactName && (
                <Text style={styles.routeContact}>{order.dropoff.contactName}{order.dropoff.contactPhone ? ` · ${order.dropoff.contactPhone}` : ''}</Text>
              )}
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Package</Text>
          {!!itemsSummary && <Text style={styles.packageLine}>{itemsSummary}</Text>}
          <Text style={styles.packageLine}>
            Size: {order.packageSize} · Priority: {order.priority}
          </Text>
          {order.distanceKm > 0 && (
            <Text style={styles.packageLine}>
              {order.distanceKm} km · ~{order.estimatedDurationMin} min
            </Text>
          )}
          {order.etaAt && (
            <Text style={styles.etaText}>
              ETA: {new Date(order.etaAt).toLocaleString()}
            </Text>
          )}
          {!!order.driver?.phone && (
            <View style={styles.driverCard}>
              <Ionicons name="person-circle-outline" size={24} color={colors.mint} />
              <View style={styles.driverInfo}>
                <Text style={styles.driverName}>
                  {order.driver.name || 'Driver'}
                  {order.driver.rating ? ` · ${Number(order.driver.rating).toFixed(1)} ★` : ''}
                </Text>
                <Text
                  href={`tel:${order.driver.phone}`}
                  onPress={handleCallDriver}
                  style={styles.phoneLink}
                >
                  <Ionicons name="call" size={14} color={colors.mint} /> {order.driver.phone}
                </Text>
              </View>
            </View>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Receipt</Text>
          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>Base</Text>
            <Text style={styles.receiptValue}>{order.currency} {Number(pricing.base || 0).toFixed(2)}</Text>
          </View>
          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>Distance Fee</Text>
            <Text style={styles.receiptValue}>{order.currency} {Number(pricing.distanceFee || 0).toFixed(2)}</Text>
          </View>
          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>Surge</Text>
            <Text style={styles.receiptValue}>{order.currency} {Number(pricing.surge || 0).toFixed(2)}</Text>
          </View>
          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>Tip</Text>
            <Text style={styles.receiptValue}>{order.currency} {Number(pricing.tip || 0).toFixed(2)}</Text>
          </View>
          <View style={[styles.receiptRow, styles.receiptTotalRow]}>
            <Text style={styles.receiptTotal}>Total</Text>
            <Text style={styles.receiptTotal}>{order.currency} {Number(order.total).toFixed(2)}</Text>
          </View>
          {order.codAmount > 0 && (
            <Text style={styles.cod}>Cash on delivery: {order.currency} {Number(order.codAmount).toFixed(2)}</Text>
          )}
        </View>

        <View style={styles.actions}>
          {order.driver?.phone && (
            <Button
              variant="secondary"
              size="md"
              title="Call Driver"
              icon={<Ionicons name="call" size={18} color={colors.text} />}
              onPress={handleCallDriver}
              style={styles.actionBtn}
            />
          )}
          {order.status === 'delivered' && !rated && (
            <Button
              variant="primary"
              size="md"
              title="Rate Driver"
              icon={<Ionicons name="star" size={18} color={colors.textInverse} />}
              onPress={() => navigation.navigate('RateOrder', { orderId: order.id })}
              style={styles.actionBtn}
            />
          )}
          {order.status === 'delivered' && (
            <Button
              variant="secondary"
              size="md"
              title="Reorder"
              icon={<Ionicons name="refresh" size={18} color={colors.text} />}
              onPress={handleReorder}
              style={styles.actionBtn}
            />
          )}
          {order.status === 'pending' && (
            <Button
              variant="destructive"
              size="md"
              title="Cancel Order"
              onPress={handleCancel}
              style={styles.actionBtn}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.base,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.base,
  },
  empty: {
    color: colors.textTertiary,
    fontSize: typography.fontSize.base,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing['6xl'],
  },
  topCard: {
    backgroundColor: colors.surfaceCard,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...elevation.md,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  orderNumber: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  date: {
    fontSize: typography.fontSize.xs,
    color: colors.textTertiary,
    marginBottom: spacing.lg,
  },
  statusBlock: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  muted: {
    fontSize: typography.fontSize.sm,
    color: colors.textTertiary,
  },
  timelineRow: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.borderLight,
    marginRight: spacing.md,
    marginTop: 3,
  },
  timelineDotLatest: {
    backgroundColor: colors.mint,
  },
  timelineLine: {
    position: 'absolute',
    left: 5,
    top: 16,
    bottom: -16,
    width: 2,
    backgroundColor: colors.border,
  },
  timelineContent: {
    flex: 1,
  },
  timelineLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
  },
  timelineTime: {
    fontSize: typography.fontSize.xs,
    color: colors.textTertiary,
    marginTop: spacing.xs,
  },
  card: {
    backgroundColor: colors.surfaceCard,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...elevation.md,
  },
  routeRow: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
  },
  routeIcon: {
    marginRight: spacing.md,
    marginTop: 2,
  },
  routeText: {
    flex: 1,
  },
  routeLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textTertiary,
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
  },
  routeValue: {
    fontSize: typography.fontSize.base,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  routeContact: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  packageLine: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  driverCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  driverInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  driverName: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  phoneLink: {
    fontSize: typography.fontSize.sm,
    color: colors.mint,
    fontWeight: typography.fontWeight.semibold,
    textDecorationLine: 'underline',
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  receiptLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  receiptValue: {
    fontSize: typography.fontSize.sm,
    color: colors.text,
  },
  receiptTotalRow: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
    marginTop: spacing.xs,
  },
  receiptTotal: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.success,
  },
  cod: {
    fontSize: typography.fontSize.xs,
    color: colors.warning,
    marginTop: spacing.sm,
  },
  etaText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.mint,
    marginBottom: spacing.sm,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  actionBtn: {
    flex: 1,
    minWidth: 140,
  },
});

export default OrderDetailScreen;
