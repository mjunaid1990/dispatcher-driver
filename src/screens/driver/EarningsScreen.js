import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { colors, spacing, borderRadius, elevation, typography } from '../../theme/theme';
import Button from '../../components/Button';
import api from '../../api/client';
import { formatCurrency } from '../../utils/currency';

const emptyPeriod = { total: 0, deliveries: 0, hours: 0, tips: 0, history: [] };

const EarningsScreen = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const { driverInfo, userInfo } = useAuth();
  const [earningsData, setEarningsData] = useState({
    today: emptyPeriod,
    week: emptyPeriod,
    month: emptyPeriod,
  });
  const [loading, setLoading] = useState(true);

  const periods = [
    { key: 'today', label: 'Today' },
    { key: 'week', label: 'This Week' },
    { key: 'month', label: 'This Month' },
  ];

  const startOfDay = () => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const startOfWeek = () => {
    const d = startOfDay();
    const day = d.getDay() || 7;
    d.setDate(d.getDate() - day + 1);
    return d;
  };

  const startOfMonth = () => {
    const d = new Date();
    d.setDate(1);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  useEffect(() => {
    loadEarnings();
  }, []);

  const loadEarnings = async () => {
    try {
      let driverId = driverInfo?._id;
      if (!driverId) {
        try {
          const res = await api.get('/drivers', { params: { userId: userInfo?._id } });
          driverId = res.data[0]?._id;
        } catch (error) {}
      }
      if (!driverId) return;

      const res = await api.get('/earnings', { params: { driverId } });
      const items = res.data || [];

      const sum = (list) => list.reduce((acc, item) => acc + (item.amount || 0), 0);
      const tipsOf = (list) => sum(list.filter((i) => i.type === 'tip'));

      const today = items.filter((i) => new Date(i.createdAt) >= startOfDay());
      const week = items.filter((i) => new Date(i.createdAt) >= startOfWeek());
      const month = items.filter((i) => new Date(i.createdAt) >= startOfMonth());

      const history = today.map((item) => ({
        id: item._id,
        customer:
          (item.orderId?.dropoff && item.orderId.dropoff.contactName) ||
          (item.orderId?.customerId && item.orderId.customerId.name) ||
          'Delivery',
        amount: item.amount || 0,
        time: new Date(item.createdAt).toLocaleTimeString([], {
          hour: 'numeric',
          minute: '2-digit',
        }),
        status: 'completed',
      }));

      setEarningsData({
        today: { total: sum(today), deliveries: today.length, hours: 0, tips: tipsOf(today), history },
        week: { total: sum(week), deliveries: week.length, hours: 0, tips: tipsOf(week), history: [] },
        month: { total: sum(month), deliveries: month.length, hours: 0, tips: tipsOf(month), history: [] },
      });
    } catch (error) {
      console.warn('Failed to load earnings:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const currentData = earningsData[selectedPeriod];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Earnings</Text>
        </View>

        {/* Period Selector */}
        <View style={styles.periodSelector}>
          {periods.map((period) => (
            <TouchableOpacity
              key={period.key}
              style={[
                styles.periodButton,
                selectedPeriod === period.key && styles.periodButtonActive,
              ]}
              onPress={() => setSelectedPeriod(period.key)}
            >
              <Text
                style={[
                  styles.periodButtonText,
                  selectedPeriod === period.key && styles.periodButtonTextActive,
                ]}
              >
                {period.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Earnings Summary */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.mint} />
          </View>
        ) : (
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total Earnings</Text>
          <Text style={styles.summaryAmount}>{formatCurrency(currentData.total)}</Text>
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{currentData.deliveries}</Text>
              <Text style={styles.statLabel}>Deliveries</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{currentData.hours}h</Text>
              <Text style={styles.statLabel}>Hours</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{formatCurrency(currentData.tips)}</Text>
              <Text style={styles.statLabel}>Tips</Text>
            </View>
          </View>
        </View>
        )}

        {/* Earnings Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Earnings Breakdown</Text>
          <View style={styles.breakdownCard}>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Base Pay</Text>
              <Text style={styles.breakdownValue}>
                {formatCurrency(currentData.total - currentData.tips)}
              </Text>
            </View>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Tips</Text>
              <Text style={[styles.breakdownValue, styles.breakdownValuePositive]}>
                +{formatCurrency(currentData.tips)}
              </Text>
            </View>
            <View style={styles.breakdownDivider} />
            <View style={styles.breakdownRow}>
              <Text style={[styles.breakdownLabel, styles.breakdownLabelTotal]}>Total</Text>
              <Text style={[styles.breakdownValue, styles.breakdownValueTotal]}>
                {formatCurrency(currentData.total)}
              </Text>
            </View>
          </View>
        </View>

        {/* Delivery History */}
        {selectedPeriod === 'today' && currentData.history.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Today's Deliveries</Text>
            {currentData.history.map((item) => (
              <View key={item.id} style={styles.historyCard}>
                <View style={styles.historyLeft}>
                  <Text style={styles.historyCustomer}>{item.customer}</Text>
                  <Text style={styles.historyTime}>{item.time}</Text>
                </View>
                <View style={styles.historyRight}>
                  <Text style={styles.historyAmount}>{formatCurrency(item.amount)}</Text>
                  <View style={[
                    styles.historyStatus,
                    item.status === 'completed' ? styles.statusCompleted : styles.statusInProgress
                  ]}>
                    <Text style={[
                      styles.historyStatusText,
                      item.status === 'completed' ? styles.statusCompletedText : styles.statusInProgressText
                    ]}>
                      {item.status === 'completed' ? 'Completed' : 'In Progress'}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Payout Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payout Information</Text>
          <View style={styles.payoutCard}>
            <View style={styles.payoutRow}>
              <Text style={styles.payoutLabel}>Next Payout</Text>
              <Text style={styles.payoutValue}>Monday, Aug 3</Text>
            </View>
            <View style={styles.payoutRow}>
              <Text style={styles.payoutLabel}>Payment Method</Text>
              <Text style={styles.payoutValue}>Direct Deposit</Text>
            </View>
            <Button
              variant="secondary"
              size="sm"
              title="View Payment History"
              onPress={() => {}}
            />
          </View>
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
  content: {
    flex: 1,
  },
  header: {
    padding: spacing['2xl'],
    backgroundColor: colors.surfaceCard,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  periodSelector: {
    flexDirection: 'row',
    padding: spacing.lg,
    gap: spacing.sm,
    backgroundColor: colors.surfaceCard,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  periodButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: colors.mint,
  },
  periodButtonText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textSecondary,
  },
  periodButtonTextActive: {
    color: colors.textInverse,
  },
  summaryCard: {
    margin: spacing.lg,
    backgroundColor: colors.mint,
    borderRadius: borderRadius['2xl'],
    padding: spacing['2xl'],
    ...elevation.glow,
  },
  loadingContainer: {
    margin: spacing.lg,
    padding: spacing['3xl'],
    backgroundColor: colors.surfaceCard,
    borderRadius: borderRadius['2xl'],
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: typography.fontSize.sm,
    color: 'rgba(13, 27, 42, 0.8)',
    marginBottom: spacing.sm,
  },
  summaryAmount: {
    fontSize: typography.fontSize['5xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.textInverse,
    marginBottom: spacing['2xl'],
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textInverse,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: typography.fontSize.xs,
    color: 'rgba(13, 27, 42, 0.8)',
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(13, 27, 42, 0.2)',
  },
  section: {
    padding: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  breakdownCard: {
    backgroundColor: colors.surfaceCard,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...elevation.md,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
  breakdownLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  breakdownLabelTotal: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
  },
  breakdownValue: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
  },
  breakdownValuePositive: {
    color: colors.success,
  },
  breakdownValueTotal: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  breakdownDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
  historyCard: {
    backgroundColor: colors.surfaceCard,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...elevation.md,
  },
  historyLeft: {
    flex: 1,
  },
  historyCustomer: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  historyTime: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  historyRight: {
    alignItems: 'flex-end',
  },
  historyAmount: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.success,
    marginBottom: spacing.xs,
  },
  historyStatus: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },
  statusCompleted: {
    backgroundColor: 'rgba(45, 212, 168, 0.2)',
  },
  statusInProgress: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
  },
  historyStatusText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
  },
  statusCompletedText: {
    color: colors.success,
  },
  statusInProgressText: {
    color: colors.info,
  },
  payoutCard: {
    backgroundColor: colors.surfaceCard,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...elevation.md,
  },
  payoutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  payoutLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  payoutValue: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
  },
});

export default EarningsScreen;
