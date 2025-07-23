import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity ,TextInput, Alert } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { getDocs, collection, query, where } from 'firebase/firestore';
import { db, auth } from '../../firebaseConfig';
import { Picker } from '@react-native-picker/picker';


type Task = {
  id: string;
  text: string;
  [key: string]: any;
};

export default function FocusMode(){
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isCountUp, setIsCountUp] = useState(false); 
  const [customMinutes, setCustomMinutes] = useState(25);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const intervalRef = useRef<number| null>(null);
  const [pickerKey, setPickerKey] = useState(0);

  
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (!isCountUp && prev === 0) {
            clearInterval(intervalRef.current!);
            setIsRunning(false);
            alert('Focus session complete!');
            return 0;
          }
          return isCountUp ? prev + 1 : prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(intervalRef.current!);
  }, [isRunning, isCountUp]);


  useFocusEffect(
    React.useCallback(() => {
      
      const fetchTasks = async () => {
        const uid = auth.currentUser?.uid;
        if (!uid) return;

        const q = query(collection(db, 'todos'), where('uid', '==', uid));
        const snapshot = await getDocs(q);

        const data = snapshot.docs.map(doc => {
          const docData = doc.data();
          return {
            id: doc.id,
            text: docData.text ?? 'Untitled Task',
          };
        });
        setTasks(data);
      };
      fetchTasks();
    }, [])
  );

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}> Focus Mode</Text>
      <Picker
        key={pickerKey} //  force re-render
        style={styles.picker}
        dropdownIconColor="#f2f2f2ff"
        selectedValue={selectedTask?.id || ''}
        onValueChange={(itemValue) => {
          if (isRunning) {
            // Reset the picker
            setPickerKey(prev => prev + 1);
            Alert.alert(
              '⏳ Focus in Progress',
              'Please stop the timer before switching tasks.'
            );
            return;
          }

          const foundTask = tasks.find(t => t.id === itemValue);
          setSelectedTask(foundTask || null);
        }}
      >
        <Picker.Item label="Select a task" value="" style={{ color: '#fff' }} />
        {tasks.map(task => (
          <Picker.Item key={task.id} label={task.text} value={task.id} />
        ))}
      </Picker>

      <Text style={styles.timer}>{formatTime(secondsLeft)}</Text>
      <View style={styles.timeInputRow}>
        <TextInput
          keyboardType="numeric"
          placeholder="Enter minutes"
          placeholderTextColor="#aaa"
          style={styles.timeInput}
          value={customMinutes.toString()}
          onChangeText={(text) => {
            const value = parseInt(text);
            if (!isNaN(value)) {
              setCustomMinutes(value);
            }
          }}
        />
        <TouchableOpacity
          style={styles.setTimeButton}
          onPress={() => {
            setSecondsLeft(customMinutes * 60);
          }}
        >
          <Text style={styles.setTimeButtonText}>Set Time</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.modeButton}
        onPress={() => {
          setIsCountUp((prev) => {
            const newMode = !prev;
            setSecondsLeft(newMode ? 0 : customMinutes * 60);
            return newMode;
          });
        }}
      >
        <Text style={styles.buttonText}>
          Mode: {isCountUp ? 'Stopwatch ⏱' : 'Countdown ⏳'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.timeButton}
        onPress={() => {
          if (!selectedTask) {
            Alert.alert('⚠️ Select a Task', 'Please choose a task before starting focus mode.');
            return;
          }

          if (!isRunning && !isCountUp) {
            setSecondsLeft(customMinutes * 60);
          }
          setIsRunning(prev => !prev);
        }}
      >
        <Text style={styles.buttonText}>
          {isRunning ? '⏹ Stop' : '▶ Start'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f', // deeper dark for sleek look
    padding: 20,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#f2f2f2',
  },
  picker: {
    backgroundColor: '#262626',
    color: '#f2f2f2',
    borderRadius: 10,
    marginBottom: 24,
    paddingHorizontal: 12,
    paddingVertical: 8,
    elevation: 3, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  timer: {
    fontSize: 56,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#4ade80', // emerald glow
    marginBottom: 24,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    color: '#fff',
  },
  modeButton: {
    backgroundColor: '#2563eb', // more vivid blue
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5,
  },
  timeButton: {
    backgroundColor: '#16a34a',
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 20,
    alignItems: 'center',
  },
  timeInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'center',
  },
  timeInput: {
    borderWidth: 1,
    borderColor: '#888',
    color: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    width: 100,
    marginRight: 10,
    borderRadius: 8,
    textAlign: 'center',
  },
  setTimeButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  setTimeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },

});
