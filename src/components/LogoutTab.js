import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import Button from './Button';
import { colors, spacing, borderRadius, typography, elevation } from '../theme/theme';

const LogoutTab = () => {
  const { logout } = useAuth();
  const navigation = useNavigation();

  const handleConfirm = async () => {
    await logout();
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Ionicons name="log-out-outline" size={48} color={colors.error} />
        <Text style={styles.title}>Log out?</Text>
        <Text style={styles.subtitle}>You will need to sign in again to continue.</Text>
        <Button
          variant="destructive"
          size="md"
          title="Logout"
          onPress={handleConfirm}
          style={styles.btn}
        />
        <Button
          variant="ghost"
          size="md"
          title="Cancel"
          onPress={() => navigation.navigate('Home')}
          style={styles.btn}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.base,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing['3xl'],
  },
  card: {
    width: '100%',
    backgroundColor: colors.surfaceCard,
    borderRadius: borderRadius['2xl'],
    padding: spacing['3xl'],
    alignItems: 'center',
    ...elevation.md,
  },
  title: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginTop: spacing.lg,
  },
  subtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing['3xl'],
  },
  btn: {
    width: '100%',
    marginBottom: spacing.sm,
  },
});

export default LogoutTab;
