import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, borderRadius, elevation, typography } from '../../theme/theme';
import Button from '../../components/Button';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigation = useNavigation();

  const handleLogin = async () => {
    const mockToken = 'mock-jwt-token';
    const mockUser = {
      id: '1',
      email: email || 'driver@example.com',
      name: 'Driver Name',
      role: 'driver',
      phone: '+1234567890',
    };
    await login(mockToken, mockUser);
    navigation.navigate('DriverHome');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.gradientBackground}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoIcon}>🚚</Text>
              <Text style={styles.logoText}>DISPATCH</Text>
            </View>
            <Text style={styles.subtitle}>Sign in to manage your deliveries</Text>
          </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="password"
            />
          </View>

          <TouchableOpacity
            style={styles.forgotPassword}
            onPress={() => Alert.alert('Info', 'Forgot password feature coming soon')}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <Button
            variant="primary"
            size="md"
            title={loading ? 'Signing in...' : 'Sign In'}
            onPress={handleLogin}
            disabled={loading}
            loading={loading}
          />

          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={styles.signupLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
    backgroundColor: colors.base,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing['2xl'],
  },
  header: {
    marginBottom: spacing['4xl'],
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  logoIcon: {
    fontSize: 48,
    marginRight: spacing.sm,
  },
  logoText: {
    fontSize: typography.fontSize['4xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    letterSpacing: 4,
  },
  subtitle: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: spacing['2xl'],
  },
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.surfaceCard,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    fontSize: typography.fontSize.base,
    color: colors.text,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: spacing['2xl'],
  },
  forgotPasswordText: {
    fontSize: typography.fontSize.sm,
    color: colors.mint,
    fontWeight: typography.fontWeight.semibold,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
  signupText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  signupLink: {
    fontSize: typography.fontSize.sm,
    color: colors.mint,
    fontWeight: typography.fontWeight.semibold,
  },
});

export default LoginScreen;
