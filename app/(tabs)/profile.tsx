import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, FlatList } from 'react-native';
import { getFocusSessions } from '@/firestore/focusTask';

type FocusSession = {
  id: string;
  taskName: string;
  startTime: Date;
  endTime: Date;
  durationInSeconds: number;
};

export default function Profile(){
  const [sessions, setSessions] = useState<FocusSession[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getFocusSessions();
      setSessions(data);
    };
    fetchData();
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${mins}m ${sec}s`;
  };


  return (
    <View style={styles.container}>
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
});