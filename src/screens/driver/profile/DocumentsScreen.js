import { View, Text, ScrollView, StyleSheet, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDriver } from '../../../hooks/useDriver';
import ScreenHeader from '../../../components/ScreenHeader';
import Button from '../../../components/Button';
import { colors, spacing, borderRadius, typography, elevation } from '../../../theme/theme';
import { showAlert } from '../../../utils/alerts';

const DocumentsScreen = () => {
  const navigation = useNavigation();
  const { driver, loading } = useDriver();
  const license = driver?.license || {};
  const vehicle = driver?.vehicle || {};

  const openDoc = (url) => {
    if (!url) {
      showAlert('Info', 'No document uploaded yet');
      return;
    }
    Linking.openURL(url).catch(() => showAlert('Error', 'Could not open document'));
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Documents" />
      <ScrollView contentContainerStyle={styles.content}>
        {loading && <Text style={styles.hint}>Loading documents...</Text>}

        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.label}>Verification Status</Text>
            <Text style={[styles.value, driver?.isVerified ? styles.verified : styles.unverified]}>
              {driver?.isVerified ? 'Verified' : 'Pending Verification'}
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Driver License</Text>
          <View style={styles.row}>
            <Text style={styles.label}>License Number</Text>
            <Text style={styles.value}>{license.number || 'Not provided'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Expiry</Text>
            <Text style={styles.value}>
              {license.expiryAt ? String(license.expiryAt).slice(0, 10) : 'Not provided'}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>License Document</Text>
            <Text style={[styles.value, styles.link]} onPress={() => openDoc(license.docUrl)}>
              {license.docUrl ? 'View document' : 'Not uploaded'}
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Vehicle</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Type</Text>
            <Text style={styles.value}>{vehicle.type ? vehicle.type.toUpperCase() : 'Not provided'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Plate</Text>
            <Text style={styles.value}>{vehicle.plate || 'Not provided'}</Text>
          </View>
        </View>

        <View style={styles.noteCard}>
          <Text style={styles.noteTitle}>How verification works</Text>
          <Text style={styles.noteText}>
            Upload your license and vehicle documents to get verified. Once reviewed, your
            verification status will update here.
          </Text>
          <Button
            variant="outline"
            size="sm"
            title="Contact Support"
            onPress={() => navigation.navigate('ProfileSupport')}
          />
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
    padding: spacing.lg,
  },
  hint: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  card: {
    backgroundColor: colors.surfaceCard,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...elevation.md,
  },
  sectionLabel: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  label: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  value: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
  },
  verified: {
    color: colors.success,
  },
  unverified: {
    color: colors.warning,
  },
  link: {
    color: colors.mint,
  },
  noteCard: {
    backgroundColor: 'rgba(96, 165, 250, 0.1)',
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.info,
  },
  noteTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.info,
    marginBottom: spacing.xs,
  },
  noteText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
});

export default DocumentsScreen;
