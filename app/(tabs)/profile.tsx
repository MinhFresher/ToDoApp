import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

import { getFocusSessions } from '@/firestore/focusTask';
import { auth } from '../../firebaseConfig';
import Logout from '@/components/LogoutButton';
import { onAuthStateChanged } from 'firebase/auth';
import EditForm from '@/components/UpdateInfo';

type FocusSession = {
  id: string;
  taskName: string;
  startTime: Date;
  endTime: Date;
  durationInSeconds: number;
};

export default function Profile(){
  const user = auth.currentUser;
  const [sessions, setSessions] = useState<FocusSession[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setSessions([]); // Clear if logged out
        return;
      }
      const data = await getFocusSessions();
      setSessions(data);
    });
    return () => unsubscribe(); // Cleanup listener
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${mins}m ${sec}s`;
  };


  return (
    <View style={styles.container}>
      <View style={styles.profile}>
        <Text style={styles.infoText}>👤 Email: {user?.email}</Text>
        <View style={styles.nameSession}>
          <Text style={styles.infoText}>🪪 Name: {user?.displayName || 'No name set'}</Text>
          <EditForm/>
        </View>
      </View>

      <Text style={styles.header}>Focus History</Text>
      <FlatList
        data={sessions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.sessionItem}>
            <Text style={styles.taskName}>{item.taskName}</Text>
            <Text style={styles.detail}>
              {formatTime(item.durationInSeconds)}
            </Text>
            <Text style={styles.detail}>
              {item.startTime.toLocaleString()}
            </Text>
          </View>
        )}
      />
      <Logout/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    padding: 20, 
    flex: 1, 
    backgroundColor: '#0f0f0f' 
  },
  header: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#fff', 
    marginBottom: 10 
  },
  sessionItem: {
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#333',
    borderRadius: 10,
  },
  taskName: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
  detail: { 
    color: '#ccc', 
    fontSize: 14 
  },
  profile: {
    backgroundColor: '#ffffff1a', 
    borderRadius: 12, 
    padding: 20, 
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoText: {
    color: '#ffffff',
    fontSize: 16, 
    letterSpacing: 0.5, 
  },
  nameSession: {
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    marginTop: 10, 
  },
});