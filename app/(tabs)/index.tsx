import React, { useCallback, useEffect, useState } from 'react';
import { Text, View } from 'react-native';

// Siguraduhing may type/interface para sa state
interface Student {
  id: string;
  name: string;
}

export default function HomeScreen() {
  const [students, setStudents] = useState<Student[]>([]);

  // Gamitin ang useCallback na walang naiwang external references
  const fetchStudents = useCallback(async () => {
    try {
      // Palitan ng actual API call o helper function mo
      const data: Student[] = []; 
      setStudents(data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  return (
    <View>
      <Text>Students Count: {students.length}</Text>
    </View>
  );
}