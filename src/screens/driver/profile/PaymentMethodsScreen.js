import { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import api from '../../../api/client';
import { useDriver } from '../../../hooks/useDriver';
import ScreenHeader from '../../../components/ScreenHeader';
import { colors, spacing, borderRadius, typography, elevation } from '../../../theme/theme';
import { showAlert } from '../../../utils/alerts';
import { formatCurrency } from '../../../utils/currency';

const payoutStatusColors = {
  pending: colors.warning,
  processing: colors.info,
  paid: colors.success,
  failed: colors.error,
};

const PaymentMethodsScreen = () => {
  const { driver, loading } = useDriver();
  const [payouts, setPayouts] = useState([]);
  const [loadingPayouts, setLoadingPayouts] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadPayouts = useCallback(async () => {
    if (!driver) {
      setLoadingPayouts(false);
      return;
    }
    try {
      const res = await api.get('/earnings/payouts', { params: { driverId: driver._id } });
      setPayouts(res.data || []);
    } catch (error) {
      showAlert('Error', error.response?.data?.message || 'Failed to load payment history');
    } finally {
      setLoadingPayouts(false);
    }
  }, [driver]);

  useEffect(() => {
    loadPayouts();
  }, [loadPayouts]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPayouts();
    setRefreshing(false);
  };

  const renderPayout = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.amount}>{formatCurrency(item.amount || 0)}</Text>
        <Text style={[styles.status, { color: payoutStatusColors[item.status] || colors.textSecondary }]}>
          {(item.status || 'pending').toUpperCase()}
        </Text>
      </View>
      <Text style={styles.meta}>{item.method || 'Direct Deposit'}</Text>
      <Text style={styles.meta}>
        {item.paidAt
          ? `Paid ${new Date(item.paidAt).toLocaleDateString()}`
          : `Initiated ${new Date(item.createdAt).toLocaleDateString()}`}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScreenHeader title="Payment Methods" />
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Available Balance</Text>
        <Text style={styles.balanceAmount}>
          {formatCurrency(driver?.earningsBalance ?? 0)}
        </Text>
        <Text style={styles.balanceHint}>Payouts are processed weekly</Text>
      </View>

      <Text style={styles.sectionTitle}>Payout History</Text>
      {loading || loadingPayouts ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.mint} />
        </View>
      ) : (
        <FlatList
          data={payouts}
          keyExtractor={(item) => item._id}
          renderItem={renderPayout}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            <Text style={styles.empty}>No payouts yet</Text>
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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  balanceCard: {
    margin: spacing.lg,
    backgroundColor: colors.mint,
    borderRadius: borderRadius['2xl'],
    padding: spacing['2xl'],
    ...elevation.glow,
  },
  balanceLabel: {
    fontSize: typography.fontSize.sm,
    color: 'rgba(13, 27, 42, 0.8)',
    marginBottom: spacing.sm,
  },
  balanceAmount: {
    fontSize: typography.fontSize['5xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.textInverse,
    marginBottom: spacing.sm,
  },
  balanceHint: {
    fontSize: typography.fontSize.xs,
    color: 'rgba(13, 27, 42, 0.8)',
  },
  sectionTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing['4xl'],
  },
  empty: {
    textAlign: 'center',
    color: colors.textTertiary,
    fontSize: typography.fontSize.base,
    marginTop: spacing['4xl'],
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
    marginBottom: spacing.sm,
  },
  amount: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  status: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
  meta: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
});

export default PaymentMethodsScreen;
