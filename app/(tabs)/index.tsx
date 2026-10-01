import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { API_BASE_URL } from '../../constants/api';
import { useAuth } from '../../context/AuthContext';

interface Student {
  id: string | number;
  name: string;
  email?: string;
  section?: string;
}

export default function DashboardScreen() {
  const { token } = useAuth();
  const router = useRouter();

  const [students, setStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch(`${API_BASE_URL}/students`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch students.');
      }

      const data = await response.json();
      setStudents(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Search/Filter Functionality
  const filteredStudents = students.filter((student) =>
    student.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Search Input */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search students..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* Loading State */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={{ marginTop: 10 }}>Loading students...</Text>
        </View>
      ) : error ? (
        /* Error State */
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchStudents}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : filteredStudents.length === 0 ? (
        /* Empty State */
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>No students found.</Text>
        </View>
      ) : (
        /* Student List */
        <FlatList
          data={filteredStudents}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push(`/student/${item.id}`)}
            >
              <Text style={styles.studentName}>{item.name}</Text>
              {item.section ? <Text>Section: {item.section}</Text> : null}
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  searchInput: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 16,
  },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  studentName: { fontSize: 18, fontWeight: 'bold' },
  errorText: { color: 'red', fontSize: 16, marginBottom: 12 },
  retryButton: { backgroundColor: '#007AFF', padding: 10, borderRadius: 6 },
  retryText: { color: '#fff', fontWeight: 'bold' },
  emptyText: { fontSize: 16, color: '#666' },
});