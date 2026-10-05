import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function ProfileScreen() {
  const router = useRouter();
  const auth = useAuth();

  const user = auth?.user;
  // Sinesiguradong alinman sa signOut o logout ang gamitin ng AuthContext ay gagana
  const handleLogout = auth?.signOut || auth?.logout || (() => {});

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backText}>← Back to Dashboard</Text>
        </TouchableOpacity>

        <View style={styles.profileCard}>
          {/* User Avatar Circle */}
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </Text>
          </View>

          <Text style={styles.name}>{user?.name || 'User Profile'}</Text>
          <Text style={styles.email}>{user?.email || 'student@school.edu'}</Text>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.logoutButton}
            activeOpacity={0.8}
            onPress={handleLogout}
          >
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  backText: {
    color: '#2563EB',
    fontSize: 15,
    fontWeight: '600',
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    maxWidth: 400,
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#2563EB',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#2563EB',
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 20,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#F1F5F9',
    marginBottom: 20,
  },
  logoutButton: {
    width: '100%',
    backgroundColor: '#FEF2F2',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  logoutText: {
    color: '#DC2626',
    fontSize: 15,
    fontWeight: '600',
  },
});