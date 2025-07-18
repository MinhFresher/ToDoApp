import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebaseConfig'; // adjust if your path is different
import { User } from 'firebase/auth';

export default function RootLayout() {
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setChecking(false);
    });

    return unsubscribe;
  }, []);

  if (checking) return null; // optional splash/loading here

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name={user ? '(tabs)' : 'auth/login'} />
      <Stack.Screen name="auth/register" />
    </Stack>
  );
}
