import { Text, View, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import { db } from '../../firebaseConfig'; 
import { collection, addDoc, onSnapshot, query, orderBy, where } from 'firebase/firestore';
import Task from '@/components/Task';
import { getAuth } from 'firebase/auth';

type Todo = {
  id: string; // Firestore document ID
  text: string;
  checked: boolean;
  createdAt: Date;
};

type GroupedTodos = {
  [date: string]: Todo[];
};

export default function Index() {
  const [value, setValue] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [groupedTodos, setGroupedTodos] = useState<GroupedTodos>({});

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, 'todos'),
      where('uid', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const grouped: GroupedTodos = {};

      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        const createdAt = data.createdAt?.toDate?.() ?? new Date();
        const dateKey = createdAt.toDateString(); 

        const todo: Todo = {
          id: doc.id,
          text: data.text,
          checked: data.checked,
          createdAt,
        };

        if (!grouped[dateKey]) grouped[dateKey] = [];
        grouped[dateKey].push(todo);
      });

      setGroupedTodos(grouped);
    });
    return () => unsubscribe();
  }, []);

  const handleAdd = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    if (value.trim().length === 0) return;
    try {
      await addDoc(collection(db, 'todos'), {
        text: value.trim(),
        checked: false,
        createdAt: new Date(),
        uid: user.uid, 
      });
      setValue('');
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };


  const groupedFilteredTodos = Object.entries(groupedTodos).reduce((acc, [date, todos]) => {
    const filtered = todos.filter((todo) => {
      if (filter === 'all') return true;
      if (filter === 'active') return !todo.checked;
      if (filter === 'completed') return todo.checked;
    });

    if (filtered.length > 0) {
      acc[date] = filtered;
    }

    return acc;
  }, {} as Record<string, Todo[]>);


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Today</Text>

      <View style={styles.textInputForm}>
        <TextInput
          style={styles.textInput}
          placeholder="Enter your task"
          placeholderTextColor="lightgray"
          value={value}
          onChangeText={setValue}
        />
        <TouchableOpacity onPress={handleAdd}>
          <Text style={styles.addButton}>+</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filterContainer}>
        {(['all', 'active', 'completed'] as const).map((type) => (
          <TouchableOpacity key={type} onPress={() => setFilter(type)}>
            <Text
              style={[
                styles.filterButton,
                filter === type && styles.activeFilter,
              ]}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={{ width: '100%', paddingHorizontal: 30 }}>
        {Object.entries(groupedFilteredTodos).map(([date, todos]) => (
          <View key={date}>
            <Text style={styles.groupHeader}>{date}</Text>
            {todos.map((task) => (
              <Task
                key={task.id}
                id={task.id}
                text={task.text}
                checked={task.checked}
                setChecked={() => {}}
                onDelete={() => {}}
              />
            ))}
          </View>
        ))}
      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
    alignItems: 'center',
  },
  title: {
    fontSize: 35,
    textAlign: 'center',
    color: 'white',
    marginBottom: 10,
  },
  text: {
    color: '#fff',
  },
  addButton: {
    fontSize: 30,
    color: 'white',
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
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  filterButton: {
    fontSize: 16,
    color: 'gray',
    paddingHorizontal: 10,
  },
  activeFilter: {
    color: '#9677f0',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  todoList: {
    width: '100%',
    paddingHorizontal: 30,
  },
  groupHeader: {
    fontSize: 18,
    color: 'lightgray',
    marginTop: 20,
    marginBottom: 10,
  }
});