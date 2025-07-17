import { Text, View, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import { db } from '../../firebaseConfig'; 
import { collection, addDoc, onSnapshot } from 'firebase/firestore';
import Task from '@/components/Task';

type Todo = {
  id: string; // Firestore document ID
  text: string;
  checked: boolean;
  createdAt: Date;
};

export default function Index() {
  const [value, setValue] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'todos'), (snapshot) => {
      const todoList = snapshot.docs.map((doc) => ({
        id: doc.id,
        text: doc.data().text,
        checked: doc.data().checked,
        createdAt: doc.data().createdAt.toDate(), // Convert Firestore timestamp to Date
      }));
      setTodos(todoList.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())); // Sort by newest first
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  const handleAdd = async () => {
    if (value.length > 0) {
      try {
        await addDoc(collection(db, 'todos'), {
          text: value,
          checked: false,
          createdAt: new Date(),
        });
        setValue('');
      } catch (error) {
        console.error('Error adding task: ', error);
      }
    }
  };

  // Delete and toggle in Task.tsx

  return (
    <View style={styles.container}>
      <Text style={{ marginTop: '10%', fontSize: 35, textAlign: 'center', color: 'white' }}>
        Today
      </Text>
      <View style={styles.textInputForm}>
        <TextInput
          style={styles.textInput}
          onChangeText={(value) => setValue(value)}
          placeholder="Enter your task"
          placeholderTextColor="lightgray"
          value={value}
        />
        <TouchableOpacity onPress={handleAdd}>
          <Text style={{ fontSize: 30, marginBottom: 5, color: 'white' }}>+</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ width: '100%', paddingHorizontal: 30 }}>
        {todos.map((task) => (
          <Task
            key={task.id}
            text={task.text}
            checked={task.checked}
            id={task.id} // Pass Firestore ID
            setChecked={() => {}} 
            onDelete={() => {}} 
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#18191a',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
  },
  textInputForm: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2a2b2d',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginVertical: 20,
    marginHorizontal: 20,
  },
  textInput: {
    flex: 1,
    fontSize: 25,
    color: 'white',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  tinyIcon: {
    width: 50,
    height: 50,
  },
});