import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { colors, spacing, borderRadius, typography, elevation } from '../../theme/theme';
import StatusPill from '../../components/StatusPill';
import Button from '../../components/Button';
import api from '../../api/client';
import { mapOrderToCustomer } from '../../api/mappers';
import { showAlert, confirmAction } from '../../utils/alerts';

const CustomerHomeScreen = () => {
  const navigation = useNavigation();
  const { userInfo } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadOrders = useCallback(async () => {
    try {
      const res = await api.get('/orders', { params: { customerId: userInfo._id } });
      setOrders((res.data || []).map(mapOrderToCustomer));
    } catch (error) {
      showAlert('Error', error.response?.data?.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, [userInfo]);

  useFocusEffect(
    useCallback(() => {
      loadOrders();
    }, [loadOrders])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadOrders();
    setRefreshing(false);
  };

  const handleReorder = (item) => {
    confirmAction(
      'Reorder',
      `Place a new order matching ${item.orderNumber}?`,
      async () => {
        try {
          const src = item.order;
          const payload = {
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
          navigation.navigate('OrderDetail', { orderId: res.data._id });
        } catch (error) {
          showAlert('Error', error.response?.data?.message || 'Failed to reorder');
        }
      },
      { confirmText: 'Reorder' }
    );
  };

  const renderItem = ({ item }) => {
    const itemsSummary = (item.items || []).map((i) => `${i.qty || 1}x ${i.name}`).join(', ');
    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('OrderDetail', { orderId: item.id })}
      >
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.orderNumber}>{item.orderNumber}</Text>
            <Text style={styles.date}>{new Date(item.createdAt).toLocaleString()}</Text>
          </View>
          <StatusPill status={item.status} size="sm" />
        </View>

        <View style={styles.addressContainer}>
          <View style={styles.addressRow}>
            <View style={[styles.dot, styles.pickupDot]} />
            <Text style={styles.address}>{item.pickupAddress}</Text>
          </View>
          <View style={styles.addressRow}>
            <View style={[styles.dot, styles.dropoffDot]} />
            <Text style={styles.address}>{item.dropoffAddress}</Text>
          </View>
        </View>

        {!!itemsSummary && <Text style={styles.items} numberOfLines={1}>{itemsSummary}</Text>}

        <View style={styles.cardFooter}>
          <Text style={styles.total}>
            {item.currency} {Number(item.total).toFixed(2)}
          </Text>
          {item.status === 'delivered' && (
            <Button variant="outline" size="sm" title="Reorder" onPress={() => handleReorder(item)} />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {userInfo?.name?.split(' ')[0] || 'there'}</Text>
          <Text style={styles.subtitle}>Your deliveries</Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('NewOrder')}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={24} color={colors.textInverse} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.mint} />
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="cube-outline" size={48} color={colors.textTertiary} />
              <Text style={styles.empty}>No orders yet. Place your first delivery!</Text>
              <Button
                variant="primary"
                size="md"
                title="New Order"
                onPress={() => navigation.navigate('NewOrder')}
                style={styles.emptyBtn}
              />
            </View>
          }
        />
      )}
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
  addButton: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    backgroundColor: colors.mint,
    justifyContent: 'center',
    alignItems: 'center',
    ...elevation.glow,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: spacing.lg,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: spacing['6xl'],
  },
  empty: {
    textAlign: 'center',
    color: colors.textTertiary,
    fontSize: typography.fontSize.base,
    marginTop: spacing.lg,
  },
  emptyBtn: {
    marginTop: spacing.lg,
  },
  card: {
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
  orderNumber: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  date: {
    fontSize: typography.fontSize.xs,
    color: colors.textTertiary,
    marginTop: spacing.xs,
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
    marginRight: spacing.md,
    marginTop: 6,
  },
  pickupDot: {
    backgroundColor: colors.mint,
  },
  dropoffDot: {
    backgroundColor: colors.error,
  },
  address: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  items: {
    fontSize: typography.fontSize.xs,
    color: colors.textTertiary,
    marginBottom: spacing.md,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
  },
  total: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.success,
  },
});

export default CustomerHomeScreen;
