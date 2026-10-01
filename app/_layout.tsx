import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { AuthProvider, useAuth } from '../context/AuthContext';

function InitialLayout() {
  const { token, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    // Ang file name mo sa explorer ay sign-in.tsx
    const inAuthGroup = segments[0] === 'sign-in';

    if (!token && !inAuthGroup) {
      // I-redirect sa /sign-in kapag walang token
      router.replace('/sign-in');
    } else if (token && inAuthGroup) {
      // I-redirect sa home kapag naka-login na
      router.replace('/');
    }
  }, [token, isLoading, segments]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Slot />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <InitialLayout />
    </AuthProvider>
  );
}