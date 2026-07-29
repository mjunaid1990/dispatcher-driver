import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { colors, spacing, borderRadius, elevation, typography } from '../../theme/theme';
import Button from '../../components/Button';

const EarningsScreen = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('today');

  const periods = [
    { key: 'today', label: 'Today' },
    { key: 'week', label: 'This Week' },
    { key: 'month', label: 'This Month' },
  ];

  const earningsData = {
    today: {
      total: 87.50,
      deliveries: 7,
      hours: 5.5,
      tips: 12.50,
      history: [
        { id: '1', customer: 'John Doe', amount: 12.50, time: '10:30 AM', status: 'completed' },
        { id: '2', customer: 'Jane Smith', amount: 15.00, time: '11:45 AM', status: 'completed' },
        { id: '3', customer: 'Bob Johnson', amount: 18.50, time: '1:15 PM', status: 'completed' },
        { id: '4', customer: 'Alice Brown', amount: 14.00, time: '2:30 PM', status: 'completed' },
        { id: '5', customer: 'Charlie Davis', amount: 16.00, time: '3:45 PM', status: 'completed' },
        { id: '6', customer: 'Diana Lee', amount: 11.50, time: '4:20 PM', status: 'completed' },
        { id: '7', customer: 'Frank Wilson', amount: 10.00, time: '5:10 PM', status: 'in_progress' },
      ],
    },
    week: {
      total: 525.00,
      deliveries: 42,
      hours: 38,
      tips: 85.00,
      history: [],
    },
    month: {
      total: 2100.00,
      deliveries: 168,
      hours: 152,
      tips: 340.00,
      history: [],
    },
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
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total Earnings</Text>
          <Text style={styles.summaryAmount}>${currentData.total.toFixed(2)}</Text>
          
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
              <Text style={styles.statValue}>${currentData.tips.toFixed(2)}</Text>
              <Text style={styles.statLabel}>Tips</Text>
            </View>
          </View>
        </View>

        {/* Earnings Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Earnings Breakdown</Text>
          <View style={styles.breakdownCard}>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Base Pay</Text>
              <Text style={styles.breakdownValue}>
                ${(currentData.total - currentData.tips).toFixed(2)}
              </Text>
            </View>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Tips</Text>
              <Text style={[styles.breakdownValue, styles.breakdownValuePositive]}>
                +${currentData.tips.toFixed(2)}
              </Text>
            </View>
            <View style={styles.breakdownDivider} />
            <View style={styles.breakdownRow}>
              <Text style={[styles.breakdownLabel, styles.breakdownLabelTotal]}>Total</Text>
              <Text style={[styles.breakdownValue, styles.breakdownValueTotal]}>
                ${currentData.total.toFixed(2)}
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
                  <Text style={styles.historyAmount}>${item.amount.toFixed(2)}</Text>
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
