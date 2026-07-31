import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors, spacing, borderRadius, elevation, typography } from '../../theme/theme';
import Button from '../../components/Button';
import { showAlert } from '../../utils/alerts';
import { formatCurrency } from '../../utils/currency';

const DeliveryDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { delivery } = route.params || {};

  const statusSteps = [
    { key: 'assigned', label: 'Assigned' },
    { key: 'picked_up', label: 'Picked Up' },
    { key: 'in_transit', label: 'In Transit' },
    { key: 'delivered', label: 'Delivered' },
  ];

  const getCurrentStepIndex = () => {
    const statusMap = {
      'assigned': 0,
      'accepted': 0,
      'picked_up': 1,
      'in_transit': 2,
      'delivered': 3,
    };
    return statusMap[delivery?.status] || 0;
  };

  const handleStatusUpdate = () => {
    navigation.navigate('DeliveryStatus', { delivery });
  };

  const handleCallCustomer = () => {
    showAlert('Call Customer', `Calling ${delivery?.customerName}...`);
  };

  const handleNavigate = (address) => {
    showAlert('Navigation', `Opening navigation to: ${address}`);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Delivery Details</Text>
          <View style={{ width: 50 }} />
        </View>

        {/* Customer Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer</Text>
          <View style={styles.customerCard}>
            <View style={styles.customerInfo}>
              <Text style={styles.customerName}>{delivery?.customerName}</Text>
              <Text style={styles.customerId}>Order #{delivery?.id}</Text>
            </View>
            <Button
              variant="primary"
              size="sm"
              title="Call"
              onPress={handleCallCustomer}
            />
          </View>
        </View>

        {/* Addresses */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Route</Text>
          <View style={styles.addressCard}>
            <TouchableOpacity
              style={styles.addressRow}
              onPress={() => handleNavigate(delivery?.pickupAddress)}
            >
              <View style={[styles.dot, styles.pickupDot]} />
              <View style={styles.addressContent}>
                <Text style={styles.addressLabel}>Pickup</Text>
                <Text style={styles.address}>{delivery?.pickupAddress}</Text>
              </View>
              <Text style={styles.navigateText}>Navigate →</Text>
            </TouchableOpacity>
            
            <View style={styles.divider} />
            
            <TouchableOpacity
              style={styles.addressRow}
              onPress={() => handleNavigate(delivery?.dropoffAddress)}
            >
              <View style={[styles.dot, styles.dropoffDot]} />
              <View style={styles.addressContent}>
                <Text style={styles.addressLabel}>Drop-off</Text>
                <Text style={styles.address}>{delivery?.dropoffAddress}</Text>
              </View>
              <Text style={styles.navigateText}>Navigate →</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Status Progress */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Progress</Text>
          <View style={styles.progressCard}>
            {statusSteps.map((step, index) => {
              const currentStep = getCurrentStepIndex();
              const isCompleted = index <= currentStep;
              const isCurrent = index === currentStep;
              
              return (
                <View key={step.key} style={styles.stepContainer}>
                  <View style={styles.stepRow}>
                    <View
                      style={[styles.stepDot, isCompleted && styles.stepDotCompleted, isCurrent && styles.stepDotCurrent]}
                    >
                      {isCompleted && <Text style={styles.stepDotText}>✓</Text>}
                    </View>
                    <Text
                      style={[
                        styles.stepLabel,
                        isCompleted && styles.stepLabelCompleted,
                        isCurrent && styles.stepLabelCurrent,
                      ]}
                    >
                      {step.label}
                    </Text>
                  </View>
                  {index < statusSteps.length - 1 && (
                    <View
                      style={[
                        styles.stepLine,
                        isCompleted && styles.stepLineCompleted,
                      ]}
                    />
                  )}
                </View>
              );
            })}
          </View>
        </View>

        {/* Delivery Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Info</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Earnings</Text>
              <Text style={styles.infoValue}>{formatCurrency(delivery?.earnings)}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Estimated Time</Text>
              <Text style={styles.infoValue}>{delivery?.estimatedTime}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Distance</Text>
              <Text style={styles.infoValue}>{delivery?.distance || 'N/A'}</Text>
            </View>
          </View>
        </View>

        {/* Special Instructions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Special Instructions</Text>
          <View style={styles.instructionsCard}>
            <Text style={styles.instructionsText}>
              Please call upon arrival. Leave at door if no answer.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Update Status Button */}
      <View style={styles.footer}>
        <Button
          variant="primary"
          size="md"
          title="Update Status"
          onPress={handleStatusUpdate}
        />
      </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.surfaceCard,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    fontSize: typography.fontSize.base,
    color: colors.mint,
    fontWeight: typography.fontWeight.semibold,
  },
  headerTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
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
  customerCard: {
    backgroundColor: colors.surfaceCard,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...elevation.md,
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  customerId: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  addressCard: {
    backgroundColor: colors.surfaceCard,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...elevation.md,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: spacing.md,
  },
  pickupDot: {
    backgroundColor: colors.mint,
  },
  dropoffDot: {
    backgroundColor: colors.error,
  },
  addressContent: {
    flex: 1,
  },
  addressLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  address: {
    fontSize: typography.fontSize.sm,
    color: colors.text,
  },
  navigateText: {
    fontSize: typography.fontSize.sm,
    color: colors.mint,
    fontWeight: typography.fontWeight.semibold,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.lg,
    marginLeft: spacing['2xl'],
  },
  progressCard: {
    backgroundColor: colors.surfaceCard,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...elevation.md,
  },
  stepContainer: {
    alignItems: 'center',
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceElevated,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  stepDotCompleted: {
    backgroundColor: colors.mint,
  },
  stepDotCurrent: {
    backgroundColor: colors.mint,
  },
  stepDotText: {
    color: colors.textInverse,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  stepLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.textTertiary,
  },
  stepLabelCompleted: {
    color: colors.mint,
    fontWeight: typography.fontWeight.semibold,
  },
  stepLabelCurrent: {
    color: colors.mint,
    fontWeight: typography.fontWeight.semibold,
  },
  stepLine: {
    height: 32,
    width: 2,
    backgroundColor: colors.surfaceElevated,
    marginLeft: 15,
  },
  stepLineCompleted: {
    backgroundColor: colors.mint,
  },
  infoCard: {
    backgroundColor: colors.surfaceCard,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...elevation.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  infoValue: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
  },
  instructionsCard: {
    backgroundColor: colors.surfaceCard,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...elevation.md,
  },
  instructionsText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  footer: {
    backgroundColor: colors.surfaceCard,
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});

export default DeliveryDetailScreen;
