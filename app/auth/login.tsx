import { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'expo-router';
import { auth } from 'firebaseConfig'

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace('/(tabs)'); 
    } catch (error: any) {
      Alert.alert('Login Failed', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Login</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button title="Login" onPress={handleLogin} />
      <Text onPress={() => router.push('/auth/register')} style={styles.link}>
        Don't have an account? Register
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20, 
    flex: 1, 
    justifyContent: 'center', 
    backgroundColor: '#000' 
  },
  header: {
    fontSize: 30,
    color: '#fff',
    marginBottom: 20 
  },
  input: { 
    backgroundColor: '#222', 
    color: 'white', 
    marginBottom: 10, 
    padding: 10, borderRadius: 5 
  },
  link: { 
    color: '#9677f0', 
    marginTop: 20, 
    textAlign: 'center' 
  }
});
