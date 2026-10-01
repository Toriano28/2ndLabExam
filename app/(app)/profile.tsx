import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Profile</Text>

      {user ? (
        <View style={styles.card}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{user.name || user.username || 'N/A'}</Text>

          {user.email ? (
            <>
              <Text style={styles.label}>Email:</Text>
              <Text style={styles.value}>{user.email}</Text>
            </>
          ) : null}

          {user.role ? (
            <>
              <Text style={styles.label}>Role:</Text>
              <Text style={styles.value}>{user.role}</Text>
            </>
          ) : null}
        </View>
      ) : (
        <Text style={styles.noUserText}>No profile data available.</Text>
      )}

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5', justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  card: { backgroundColor: '#fff', padding: 20, borderRadius: 10, marginBottom: 20, borderWidth: 1, borderColor: '#e0e0e0' },
  label: { fontSize: 14, color: '#666', marginTop: 8 },
  value: { fontSize: 18, fontWeight: '600', color: '#333' },
  noUserText: { textAlign: 'center', marginVertical: 20, color: '#666' },
  logoutButton: { backgroundColor: '#FF3B30', padding: 15, borderRadius: 8, alignItems: 'center' },
  logoutText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});