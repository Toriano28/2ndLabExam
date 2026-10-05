import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';

// TypeScript Interface para sa Student Object
interface Student {
  id: string;
  name: string;
  email: string;
  course: string;
  yearLevel: string;
}

export default function StudentsScreen() {
  const router = useRouter();
  const { token } = useAuth(); // Gamitin ang token kung kinakailangan sa API request

  const [students, setStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Mock API Fetching / Pwedeng palitan ng tunay mong API endpoint
  const fetchStudents = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // halimbawa: const response = await fetch('https://api.example.com/students', { headers: { Authorization: `Bearer ${token}` } });
      // Simulating API Latency (1 second delay)
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Dummy API Data
      const dummyData: Student[] = [
        { id: '1', name: 'Juan Dela Cruz', email: 'juan@school.edu', course: 'BSIT', yearLevel: '3rd Year' },
        { id: '2', name: 'Maria Clara', email: 'maria@school.edu', course: 'BSCS', yearLevel: '2nd Year' },
        { id: '3', name: 'Crisostomo Ibarra', email: 'ibarra@school.edu', course: 'BSIS', yearLevel: '4th Year' },
        { id: '4', name: 'Sisa Santos', email: 'sisa@school.edu', course: 'ACT', yearLevel: '1st Year' },
      ];

      setStudents(dummyData);
    } catch (err) {
      setError('Failed to load students directory. Please try again.');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchStudents();
  };

  // Search/Filter Functionality
  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Students Directory</Text>
          <Text style={styles.subtitle}>View and search registered students</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, email, or course..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* 1. LOADING STATE */}
        {isLoading && !refreshing ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#2563EB" />
            <Text style={styles.stateText}>Loading students directory...</Text>
          </View>
        ) : error ? (
          /* 2. ERROR STATE */
          <View style={styles.centerContainer}>
            <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchStudents}>
              <Text style={styles.retryButtonText}>Retry Request</Text>
            </TouchableOpacity>
          </View>
        ) : filteredStudents.length === 0 ? (
          /* 3. EMPTY STATE */
          <View style={styles.centerContainer}>
            <Text style={styles.emptyTitle}>No Students Found</Text>
            <Text style={styles.stateText}>
              {searchQuery ? `No results for "${searchQuery}"` : 'There are no students listed at this time.'}
            </Text>
          </View>
        ) : (
          /* 4. STUDENT LIST (DYNAMIC DETAILS) */
          <FlatList
            data={filteredStudents}
            keyExtractor={(item) => item.id}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={['#2563EB']} />}
            contentContainerStyle={styles.listContainer}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.studentCard}
                activeOpacity={0.7}
                onPress={() => router.push(`/student/${item.id}`)}
              >
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{item.name.charAt(0).toUpperCase()}</Text>
                </View>
                <View style={styles.studentInfo}>
                  <Text style={styles.studentName}>{item.name}</Text>
                  <Text style={styles.studentEmail}>{item.email}</Text>
                  <View style={styles.badgeContainer}>
                    <Text style={styles.courseBadge}>{item.course}</Text>
                    <Text style={styles.yearBadge}>{item.yearLevel}</Text>
                  </View>
                </View>
                <Text style={styles.chevron}>›</Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 16, maxWidth: 800, width: '100%', alignSelf: 'center' },
  header: { marginBottom: 16 },
  backButton: { marginBottom: 8 },
  backButtonText: { color: '#2563EB', fontSize: 15, fontWeight: '600' },
  title: { fontSize: 26, fontWeight: '800', color: '#0F172A' },
  subtitle: { fontSize: 14, color: '#64748B', marginTop: 2 },
  searchContainer: { marginBottom: 16 },
  searchInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#0F172A',
  },
  listContainer: { paddingBottom: 24, gap: 12 },
  studentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  avatarText: { fontSize: 18, fontWeight: '700', color: '#2563EB' },
  studentInfo: { flex: 1 },
  studentName: { fontSize: 16, fontWeight: '700', color: '#1E293B' },
  studentEmail: { fontSize: 13, color: '#64748B', marginBottom: 6 },
  badgeContainer: { flexDirection: 'row', gap: 6 },
  courseBadge: {
    backgroundColor: '#DBEAFE',
    color: '#1E40AF',
    fontSize: 11,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  yearBadge: {
    backgroundColor: '#F1F5F9',
    color: '#475569',
    fontSize: 11,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  chevron: { fontSize: 22, color: '#94A3B8', fontWeight: '400' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  stateText: { marginTop: 12, fontSize: 14, color: '#64748B', textAlign: 'center' },
  errorTitle: { fontSize: 18, fontWeight: '700', color: '#EF4444', marginBottom: 6 },
  errorText: { fontSize: 14, color: '#64748B', textAlign: 'center', marginBottom: 16 },
  retryButton: { backgroundColor: '#2563EB', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  retryButtonText: { color: '#FFFFFF', fontWeight: '600', fontSize: 14 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#334155' },
});