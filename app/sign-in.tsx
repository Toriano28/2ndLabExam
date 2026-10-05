import React, { useState } from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function SignInScreen() {
  const { signInWithApi } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setErrorMessage('');
    if (!email || !password) {
      setErrorMessage('Please fill in all fields.');
      return;
    }

    setLoading(true);
    const result = await signInWithApi(email, password);
    setLoading(false);

    if (!result.success) {
      setErrorMessage(result.error || 'Invalid credentials');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Sign In</Text>
          <Text style={styles.subtitle}>Welcome back! Please enter your details.</Text>

          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

          <TextInput
            style={styles.input}
            placeholder="Email Address"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            onPress={handleSignIn}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Sign In</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  card: { backgroundColor: '#FFFFFF', width: '100%', maxWidth: 400, padding: 28, borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0' },
  title: { fontSize: 24, fontWeight: '800', color: '#0F172A', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#64748B', marginBottom: 20 },
  errorText: { color: '#DC2626', backgroundColor: '#FEF2F2', padding: 10, borderRadius: 8, marginBottom: 12, fontSize: 13, textAlign: 'center' },
  input: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 8, padding: 12, marginBottom: 12, fontSize: 14 },
  button: { backgroundColor: '#2563EB', borderRadius: 8, paddingVertical: 14, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#FFFFFF', fontWeight: '600', fontSize: 15 },
});