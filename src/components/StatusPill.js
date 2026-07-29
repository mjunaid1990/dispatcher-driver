import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, borderRadius, typography, statusColors } from '../theme/theme';

const StatusPill = ({ status, size = 'md' }) => {
  const getStatusConfig = () => {
    return statusColors[status] || statusColors.pending;
  };

  const config = getStatusConfig();

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: borderRadius.md,
        };
      case 'md':
        return {
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderRadius: borderRadius.lg,
        };
      case 'lg':
        return {
          paddingHorizontal: 16,
          paddingVertical: 8,
          borderRadius: borderRadius.xl,
        };
      default:
        return {
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderRadius: borderRadius.lg,
        };
    }
  };

  const getSizeTextStyles = () => {
    switch (size) {
      case 'sm':
        return typography.fontSize.xs;
      case 'md':
        return typography.fontSize.sm;
      case 'lg':
        return typography.fontSize.base;
      default:
        return typography.fontSize.sm;
    }
  };

  const getStatusLabel = () => {
    const labels = {
      pending: 'Pending',
      assigned: 'Assigned',
      in_transit: 'In Transit',
      arrived: 'Arrived',
      delivered: 'Delivered',
      failed: 'Failed',
      cancelled: 'Cancelled',
    };
    return labels[status] || 'Unknown';
  };

  return (
    <View
      style={[
        styles.pill,
        {
          backgroundColor: config.bg,
          borderColor: config.border,
        },
        getSizeStyles(),
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color: config.text,
            fontSize: getSizeTextStyles(),
          },
        ]}
      >
        {getStatusLabel()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  pill: {
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  text: {
    fontFamily: 'System',
    fontWeight: '600',
  },
});

export default StatusPill;
