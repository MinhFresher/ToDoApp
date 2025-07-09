import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function Profile(){

  const [user, setUser] = useState<any>(null);
  const [taskCount, setTaskCount] = useState(0);


  return (
    <View style={{ flex: 1, backgroundColor: '#1a1a1a', padding: 10, alignItems: 'center', justifyContent: 'center' }}>
      {user ? (
        <>
          <Text style={{ color: '#fff', marginBottom: 10 }}>Welcome, {user.displayName}</Text>
          <Text style={{ color: '#fff', marginBottom: 10 }}>Total Tasks: {taskCount}</Text>
          <Button title="Logout" onPress={alert} color="#ff4444" />
        </>
      ) : (
        <Button title="Login with Google" onPress={alert} color="#6200ea" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
  },
});