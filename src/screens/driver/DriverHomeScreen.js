import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { colors, spacing, borderRadius, elevation, typography } from '../../theme/theme';
import StatusPill from '../../components/StatusPill';
import Button from '../../components/Button';
import api from '../../api/client';
import { mapOrderToDelivery, mapAssignmentToDelivery, ACTIVE_STATUSES } from '../../api/mappers';
import { showAlert, confirmAction } from '../../utils/alerts';
import { formatCurrency } from '../../utils/currency';

const DriverHomeScreen = () => {
  const navigation = useNavigation();
  const { userInfo, driverInfo } = useAuth();
  const [driver, setDriver] = useState(driverInfo);
  const [activeDeliveries, setActiveDeliveries] = useState([]);
  const [availableDeliveries, setAvailableDeliveries] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(driverInfo?.status === 'online');

  const resolveDriver = async () => {
    if (driver) return driver;
    if (!userInfo) return null;
    try {
      const res = await api.get('/drivers', { params: { userId: userInfo._id } });
      const found = res.data.data ? res.data.data[0] : res.data[0] || null;
      if (found) setDriver(found);
      return found;
    } catch (error) {
      return null;
    }
  };

  const loadDeliveries = useCallback(async () => {
    const activeDriver = await resolveDriver();
    if (!activeDriver) {
      setLoading(false);
      return;
    }

    try {
      const [ordersRes, assignmentsRes] = await Promise.all([
        api.get('/orders', { params: { driverId: activeDriver._id } }),
        api.get('/assignments', { params: { driverId: activeDriver._id } }),
      ]);

      const orders = ordersRes.data || [];
      const assignments = assignmentsRes.data || [];

      const active = orders
        .filter((order) => ACTIVE_STATUSES.includes(order.status))
        .map(mapOrderToDelivery);

      const pending = assignments
        .filter((a) => a.response === 'pending' && a.orderId && typeof a.orderId === 'object')
        .map(mapAssignmentToDelivery);

      setActiveDeliveries(active);
      setAvailableDeliveries(pending);
    } catch (error) {
      console.warn('Failed to load deliveries:', error.message);
    } finally {
      setLoading(false);
    }
  }, [driver, userInfo]);

  useEffect(() => {
    loadDeliveries();
  }, [loadDeliveries]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDeliveries();
    setRefreshing(false);
  };

  const handleToggleOnline = async () => {
    const next = !isOnline;
    setIsOnline(next);
    try {
      const activeDriver = await resolveDriver();
      if (activeDriver) {
        await api.put(`/drivers/${activeDriver._id}`, { status: next ? 'online' : 'offline' });
      }
    } catch (error) {
      showAlert('Error', 'Failed to update availability');
    }
  };

  const handleAcceptDelivery = (delivery) => {
    confirmAction(
      'Accept Delivery',
      `Accept delivery for ${delivery.customerName}?`,
      async () => {
        try {
          const activeDriver = await resolveDriver();
          if (delivery.assignmentId) {
            await api.put(`/assignments/${delivery.assignmentId}`, { response: 'accepted' });
          }
          if (activeDriver) {
            await api.put(`/orders/${delivery.id}`, {
              status: 'accepted',
              assignedDriverId: activeDriver._id,
              assignedAt: new Date().toISOString(),
            });
          }
          setAvailableDeliveries((prev) => prev.filter((d) => d.id !== delivery.id));
          setActiveDeliveries((prev) => [{ ...delivery, status: 'accepted' }, ...prev]);
        } catch (error) {
          showAlert('Error', error.response?.data?.message || 'Failed to accept delivery');
        }
      },
      { confirmText: 'Accept' }
    );
  };

  const handleDeclineDelivery = (delivery) => {
    confirmAction(
      'Decline Delivery',
      'Are you sure you want to decline this delivery?',
      async () => {
        try {
          if (delivery.assignmentId) {
            await api.put(`/assignments/${delivery.assignmentId}`, {
              response: 'rejected',
              rejectReason: 'Driver declined',
            });
          }
          setAvailableDeliveries((prev) => prev.filter((d) => d.id !== delivery.id));
        } catch (error) {
          showAlert('Error', error.response?.data?.message || 'Failed to decline delivery');
        }
      },
      { confirmText: 'Decline', destructive: true }
    );
  };

  const renderActiveDelivery = ({ item }) => (
    <TouchableOpacity
      style={styles.deliveryCard}
      onPress={() => navigation.navigate('DeliveryDetail', { delivery: item })}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.customerName}>{item.customerName}</Text>
        <StatusPill status={item.status} size="sm" />
      </View>
      <View style={styles.addressContainer}>
        <View style={styles.addressRow}>
          <View style={styles.dot} />
          <Text style={styles.address}>{item.pickupAddress}</Text>
        </View>
        <View style={styles.addressRow}>
          <View style={[styles.dot, styles.dropoffDot]} />
          <Text style={styles.address}>{item.dropoffAddress}</Text>
        </View>
      </View>
      <View style={styles.cardFooter}>
        <Text style={styles.earnings}>{formatCurrency(item.earnings)}</Text>
        <Text style={styles.eta}>{item.estimatedTime}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderAvailableDelivery = ({ item }) => (
    <View style={styles.deliveryCard}>
      <View style={styles.cardHeader}>
        <Text style={styles.customerName}>{item.customerName}</Text>
        <Text style={styles.distance}>{item.distance}</Text>
      </View>
      <View style={styles.addressContainer}>
        <View style={styles.addressRow}>
          <View style={styles.dot} />
          <Text style={styles.address}>{item.pickupAddress}</Text>
        </View>
        <View style={styles.addressRow}>
          <View style={[styles.dot, styles.dropoffDot]} />
          <Text style={styles.address}>{item.dropoffAddress}</Text>
        </View>
      </View>
      <View style={styles.cardFooter}>
        <Text style={styles.earnings}>{formatCurrency(item.earnings)}</Text>
        <Text style={styles.eta}>{item.estimatedTime}</Text>
      </View>
      <View style={styles.actionButtons}>
        <Button
          variant="outline"
          size="sm"
          title="Decline"
          onPress={() => handleDeclineDelivery(item)}
          style={styles.declineButton}
        />
        <Button
          variant="primary"
          size="sm"
          title="Accept"
          onPress={() => handleAcceptDelivery(item)}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {userInfo?.name || 'Driver'}</Text>
          <Text style={styles.subtitle}>Ready for deliveries</Text>
        </View>
        <TouchableOpacity
          style={[styles.onlineToggle, isOnline && styles.onlineToggleActive]}
          onPress={handleToggleOnline}
        >
          <Text style={[styles.onlineToggleText, isOnline && styles.onlineToggleTextActive]}>
            {isOnline ? 'Online' : 'Offline'}
          </Text>
        </TouchableOpacity>
      </View>

      {activeDeliveries.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Active Delivery</Text>
          <FlatList
            data={activeDeliveries}
            renderItem={renderActiveDelivery}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Available Deliveries ({availableDeliveries.length})
        </Text>
        {loading ? (
          <View style={styles.emptyContainer}>
            <ActivityIndicator size="large" color={colors.mint} />
          </View>
        ) : (
          <FlatList
            data={availableDeliveries}
            renderItem={renderAvailableDelivery}
            keyExtractor={(item) => item.id}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No available deliveries</Text>
              </View>
            }
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.base,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.surfaceCard,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  greeting: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  subtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  onlineToggle: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius['3xl'],
    backgroundColor: colors.surfaceElevated,
  },
  onlineToggleActive: {
    backgroundColor: colors.mint,
  },
  onlineToggleText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textSecondary,
  },
  onlineToggleTextActive: {
    color: colors.textInverse,
  },
  section: {
    padding: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  deliveryCard: {
    backgroundColor: colors.surfaceCard,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...elevation.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  customerName: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
  },
  distance: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  addressContainer: {
    marginBottom: spacing.md,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.mint,
    marginRight: spacing.md,
    marginTop: 6,
  },
  dropoffDot: {
    backgroundColor: colors.error,
  },
  address: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
  },
  earnings: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.success,
  },
  eta: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  declineButton: {
    flex: 1,
  },
  emptyContainer: {
    padding: spacing['4xl'],
    alignItems: 'center',
  },
  emptyText: {
    fontSize: typography.fontSize.base,
    color: colors.textTertiary,
  },
});

export default DriverHomeScreen;
