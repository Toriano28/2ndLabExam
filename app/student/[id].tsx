import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface StudentDetail {
  id: string;
  name: string;
  email: string;
  course: string;
  yearLevel: string;
  status: string;
  gpa: string;
}

export default function StudentDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [student, setStudent] = useState<StudentDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStudentDetail = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulating API call para sa specific student ID
      await new Promise((resolve) => setTimeout(resolve, 800));

      if (!id) throw new Error('Invalid Student ID');

      // Mock Data response
      setStudent({
        id: String(id),
        name: id === '1' ? 'Juan Dela Cruz' : id === '2' ? 'Maria Clara' : 'Student ' + id,
        email: `student${id}@school.edu`,
        course: 'Bachelor of Science in Information Technology',
        yearLevel: '3rd Year - Regular',
        status: 'Enrolled',
        gpa: '1.25',
      });
    } catch (err) {
      setError('Could not load student details.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentDetail();
  }, [id]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Back Button Header */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backText}>← Back to Directory</Text>
        </TouchableOpacity>

        {isLoading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#2563EB" />
            <Text style={styles.loadingText}>Fetching details for Student #{id}...</Text>
          </View>
        ) : error ? (
          <View style={styles.centerContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchStudentDetail}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : student ? (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Header Profile Card */}
            <View style={styles.profileCard}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{student.name.charAt(0).toUpperCase()}</Text>
              </View>
              <Text style={styles.name}>{student.name}</Text>
              <Text style={styles.email}>{student.email}</Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusBadgeText}>{student.status}</Text>
              </View>
            </View>

            {/* Academic Information Card */}
            <View style={styles.infoCard}>
              <Text style={styles.cardHeader}>Academic Information</Text>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Student ID</Text>
                <Text style={styles.infoValue}>#{student.id}</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Course / Program</Text>
                <Text style={styles.infoValue}>{student.course}</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Year Level</Text>
                <Text style={styles.infoValue}>{student.yearLevel}</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Current GPA</Text>
                <Text style={[styles.infoValue, { color: '#16A34A', fontWeight: '800' }]}>
                  {student.gpa}
                </Text>
              </View>
            </View>
          </ScrollView>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 16, maxWidth: 800, width: '100%', alignSelf: 'center' },
  backButton: { marginBottom: 16, alignSelf: 'flex-start' },
  backText: { color: '#2563EB', fontSize: 15, fontWeight: '600' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, color: '#64748B', fontSize: 14 },
  errorText: { color: '#EF4444', fontSize: 16, marginBottom: 12, fontWeight: '600' },
  retryButton: { backgroundColor: '#2563EB', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
  retryText: { color: '#FFFFFF', fontWeight: '600' },
  scrollContent: { paddingBottom: 32, gap: 16 },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#2563EB',
  },
  avatarText: { fontSize: 28, fontWeight: '800', color: '#2563EB' },
  name: { fontSize: 22, fontWeight: '800', color: '#0F172A' },
  email: { fontSize: 14, color: '#64748B', marginTop: 2, marginBottom: 12 },
  statusBadge: { backgroundColor: '#DCFCE7', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  statusBadgeText: { color: '#15803D', fontSize: 12, fontWeight: '700' },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardHeader: { fontSize: 16, fontWeight: '700', color: '#1E293B', marginBottom: 16 },
  infoRow: { paddingVertical: 8 },
  infoLabel: { fontSize: 13, color: '#64748B', fontWeight: '500', marginBottom: 2 },
  infoValue: { fontSize: 15, color: '#0F172A', fontWeight: '600' },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 4 },
});