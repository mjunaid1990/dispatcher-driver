import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors, spacing, borderRadius, elevation, typography } from '../../theme/theme';

const DeliveryStatusScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { delivery } = route.params || {};
  const [notes, setNotes] = useState('');
  const [photoUploaded, setPhotoUploaded] = useState(false);
  const [signatureCaptured, setSignatureCaptured] = useState(false);

  const statusOptions = [
    { key: 'arrived_pickup', label: 'Arrived at Pickup', color: colors.warning },
    { key: 'picked_up', label: 'Picked Up', color: colors.mint },
    { key: 'in_transit', label: 'In Transit', color: colors.info },
    { key: 'arrived_dropoff', label: 'Arrived at Drop-off', color: colors.glow },
    { key: 'delivered', label: 'Delivered', color: colors.success },
    { key: 'failed', label: 'Failed Delivery', color: colors.error },
  ];

  const handleStatusUpdate = (status) => {
    if (status === 'delivered') {
      if (!photoUploaded) {
        Alert.alert('Photo Required', 'Please upload a proof of delivery photo');
        return;
      }
      if (!signatureCaptured) {
        Alert.alert('Signature Required', 'Please capture customer signature');
        return;
      }
    }

    Alert.alert(
      'Update Status',
      `Change status to "${statusOptions.find(s => s.key === status)?.label}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
            // TODO: Call API to update status
            Alert.alert('Success', 'Delivery status updated successfully');
            navigation.goBack();
          },
        },
      ]
    );
  };

  const handleUploadPhoto = () => {
    Alert.alert('Upload Photo', 'Photo upload feature - integrate with expo-image-picker');
    setPhotoUploaded(true);
  };

  const handleCaptureSignature = () => {
    Alert.alert('Capture Signature', 'Signature capture feature - integrate with react-native-signature-canvas');
    setSignatureCaptured(true);
  };

  const getCurrentStatus = () => {
    return statusOptions.find(s => s.key === delivery?.status) || statusOptions[0];
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Update Status</Text>
          <View style={{ width: 50 }} />
        </View>

        {/* Current Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Status</Text>
          <View style={[styles.statusCard, { borderLeftColor: getCurrentStatus().color }]}>
            <Text style={styles.statusLabel}>{getCurrentStatus().label}</Text>
            <Text style={styles.statusTime}>Updated 5 min ago</Text>
          </View>
        </View>

        {/* Status Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Update To</Text>
          <View style={styles.statusOptions}>
            {statusOptions.map((option) => (
              <TouchableOpacity
                key={option.key}
                style={[
                  styles.statusOption,
                  { borderLeftColor: option.color },
                ]}
                onPress={() => handleStatusUpdate(option.key)}
              >
                <View style={[styles.statusDot, { backgroundColor: option.color }]} />
                <Text style={styles.statusOptionLabel}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Proof of Delivery */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Proof of Delivery</Text>
          
          <TouchableOpacity
            style={[styles.podCard, photoUploaded && styles.podCardCompleted]}
            onPress={handleUploadPhoto}
          >
            <View style={styles.podIcon}>
              <Text style={styles.podIconText}>{photoUploaded ? '✓' : '📷'}</Text>
            </View>
            <View style={styles.podContent}>
              <Text style={styles.podTitle}>Delivery Photo</Text>
              <Text style={styles.podSubtitle}>
                {photoUploaded ? 'Photo uploaded' : 'Tap to upload photo'}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.podCard, signatureCaptured && styles.podCardCompleted]}
            onPress={handleCaptureSignature}
          >
            <View style={styles.podIcon}>
              <Text style={styles.podIconText}>{signatureCaptured ? '✓' : '✍️'}</Text>
            </View>
            <View style={styles.podContent}>
              <Text style={styles.podTitle}>Customer Signature</Text>
              <Text style={styles.podSubtitle}>
                {signatureCaptured ? 'Signature captured' : 'Tap to capture signature'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Notes</Text>
          <View style={styles.notesCard}>
            <TextInput
              style={styles.notesInput}
              placeholder="Add any notes about this delivery..."
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Issue Report */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Report Issue</Text>
          <TouchableOpacity
            style={styles.issueCard}
            onPress={() => Alert.alert('Report Issue', 'Issue reporting feature coming soon')}
          >
            <Text style={styles.issueTitle}>Report a Problem</Text>
            <Text style={styles.issueSubtitle}>
              Unable to complete delivery? Report an issue.
            </Text>
          </TouchableOpacity>
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
  statusCard: {
    backgroundColor: colors.surfaceCard,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderLeftWidth: 4,
    ...elevation.md,
  },
  statusLabel: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  statusTime: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  statusOptions: {
    gap: spacing.sm,
  },
  statusOption: {
    backgroundColor: colors.surfaceCard,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    ...elevation.md,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: spacing.md,
  },
  statusOptionLabel: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: colors.text,
  },
  podCard: {
    backgroundColor: colors.surfaceCard,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    ...elevation.md,
  },
  podCardCompleted: {
    borderLeftWidth: 4,
    borderLeftColor: colors.success,
  },
  podIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surfaceElevated,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  podIconText: {
    fontSize: typography.fontSize.xl,
  },
  podContent: {
    flex: 1,
  },
  podTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  podSubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  notesCard: {
    backgroundColor: colors.surfaceCard,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...elevation.md,
  },
  notesInput: {
    fontSize: typography.fontSize.sm,
    color: colors.text,
    minHeight: 100,
  },
  issueCard: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.error,
  },
  issueTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.error,
    marginBottom: spacing.xs,
  },
  issueSubtitle: {
    fontSize: typography.fontSize.sm,
    color: 'rgba(239, 68, 68, 0.8)',
  },
});

export default DeliveryStatusScreen;
