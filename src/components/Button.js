import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, ActivityIndicator } from 'react-native';
import { colors, borderRadius, elevation, typography } from '../theme/theme';

const Button = ({
  variant = 'primary',
  size = 'md',
  title,
  onPress,
  disabled = false,
  loading = false,
  icon,
  style,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: colors.mint,
          ...elevation.glow,
        };
      case 'secondary':
        return {
          backgroundColor: colors.surfaceElevated,
          ...elevation.md,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderColor: colors.mint,
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
        };
      case 'destructive':
        return {
          backgroundColor: colors.error,
          ...elevation.md,
        };
      case 'icon':
        return {
          backgroundColor: colors.surfaceElevated,
          ...elevation.sm,
        };
      default:
        return {
          backgroundColor: colors.mint,
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: borderRadius.md,
        };
      case 'md':
        return {
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderRadius: borderRadius.lg,
        };
      case 'lg':
        return {
          paddingHorizontal: 24,
          paddingVertical: 16,
          borderRadius: borderRadius.xl,
        };
      default:
        return {
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderRadius: borderRadius.lg,
        };
    }
  };

  const getTextStyles = () => {
    const baseStyle = {
      fontFamily: typography.fontFamily.body,
      fontWeight: typography.fontWeight.semibold,
    };

    switch (variant) {
      case 'primary':
        return { ...baseStyle, color: colors.textInverse, fontSize: typography.fontSize.base };
      case 'secondary':
        return { ...baseStyle, color: colors.text, fontSize: typography.fontSize.base };
      case 'outline':
        return { ...baseStyle, color: colors.mint, fontSize: typography.fontSize.base };
      case 'ghost':
        return { ...baseStyle, color: colors.mint, fontSize: typography.fontSize.base };
      case 'destructive':
        return { ...baseStyle, color: colors.text, fontSize: typography.fontSize.base };
      case 'icon':
        return null;
      default:
        return { ...baseStyle, color: colors.textInverse };
    }
  };

  const getSizeTextStyles = () => {
    switch (size) {
      case 'sm':
        return typography.fontSize.sm;
      case 'md':
        return typography.fontSize.base;
      case 'lg':
        return typography.fontSize.lg;
      default:
        return typography.fontSize.base;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getVariantStyles(),
        getSizeStyles(),
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? colors.textInverse : colors.mint} />
      ) : (
        <View style={styles.content}>
          {icon && <View style={styles.icon}>{icon}</View>}
          {title && (
            <Text
              style={[
                styles.text,
                getTextStyles(),
                { fontSize: getSizeTextStyles() },
              ]}
            >
              {title}
            </Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
  },
  icon: {
    marginRight: 8,
  },
  disabled: {
    opacity: 0.5,
  },
});

export default Button;
