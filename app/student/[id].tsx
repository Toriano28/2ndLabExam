import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { API_BASE_URL } from '../../constants/api';
import { useAuth } from '../../context/AuthContext';

export default function StudentDetailScreen() {
  const { id } = useLocalSearchParams();
  const { token } = useAuth();
  const router = useRouter();

  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStudentDetail = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch(`${API_BASE_URL}/students/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch student details.');
      }

      const data = await response.json();
      setStudent(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchStudentDetail();
    }
  }, [id]);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={{ marginTop: 10 }}>Loading details...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchStudentDetail}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : student ? (
        <View style={styles.card}>
          <Text style={styles.title}>{student.name || 'Student Detail'}</Text>
          <Text style={styles.detail}>ID: {student.id}</Text>
          {student.email ? <Text style={styles.detail}>Email: {student.email}</Text> : null}
          {student.section ? <Text style={styles.detail}>Section: {student.section}</Text> : null}
          {student.course ? <Text style={styles.detail}>Course: {student.course}</Text> : null}
        </View>
      ) : (
        <View style={styles.centerContainer}>
          <Text>No details available.</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  backButton: { marginBottom: 20 },
  backText: { color: '#007AFF', fontSize: 16, fontWeight: 'bold' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { backgroundColor: '#fff', padding: 20, borderRadius: 10, borderWidth: 1, borderColor: '#ddd' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 15 },
  detail: { fontSize: 16, marginBottom: 8, color: '#333' },
  errorText: { color: 'red', fontSize: 16, marginBottom: 12 },
  retryButton: { backgroundColor: '#007AFF', padding: 10, borderRadius: 6 },
  retryText: { color: '#fff', fontWeight: 'bold' },
});