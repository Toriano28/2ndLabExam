import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.badge}>STUDENT SERVICE PORTAL</Text>
          <Text style={styles.welcomeText}>Welcome, {user?.name || 'Student'} 👋</Text>
          <Text style={styles.subtitle}>Manage your academic records & services in one place.</Text>
        </View>

        {/* Quick Actions Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Quick Actions</Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity 
              style={styles.primaryButton} 
              activeOpacity={0.8}
              onPress={() => router.push('/students')}
            >
              <Text style={styles.primaryButtonText}>View Students Directory</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.primaryButton, styles.secondaryButton]} 
              activeOpacity={0.8}
              onPress={() => router.push('/profile')}
            >
              <Text style={styles.secondaryButtonText}>My Profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Status Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Session Status</Text>
          <View style={styles.statusRow}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Active Session ({user?.email || 'Authenticated'})</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    padding: 24,
    maxWidth: 800,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    marginBottom: 28,
  },
  badge: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
    letterSpacing: 1.2,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: '#64748B',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 16,
  },
  actionGrid: {
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#F1F5F9',
  },
  secondaryButtonText: {
    color: '#334155',
    fontSize: 15,
    fontWeight: '600',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#22C55E',
  },
  statusText: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '500',
  },
});