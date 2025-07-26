import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db, auth } from '@/firebaseConfig';
import { MarkedDates } from 'react-native-calendars/src/types';

type TaskMap = {
  [date: string]: { id: string; text: string }[];
};

export default function CalendarScreen(){
  const [markedDates, setMarkedDates] = useState<MarkedDates>({});
  const [tasksByDate, setTasksByDate] = useState<TaskMap>({});
  const [selectedDate, setSelectedDate] = useState<string>('');
  
  useEffect(() => {
    const fetchTasks = async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      const q = query(collection(db, 'todos'), where('uid', '==', uid));
      const snapshot = await getDocs(q);

      const tempTasks: any = {};
      const allTasks: any[] = [];

      snapshot.forEach((doc) => {
        const data = doc.data();
        const createdAt = data.createdAt?.toDate();
        if (!createdAt) return;

        const dateStr = createdAt.toISOString().split('T')[0];

        if (!tempTasks[dateStr]) tempTasks[dateStr] = [];
        tempTasks[dateStr].push({ id: doc.id, text: data.text });

        allTasks.push({ ...data, id: doc.id, dateStr });
      });

      // Set marked dates
      const marks: any = {};
      Object.keys(tempTasks).forEach((date) => {
        marks[date] = {
          marked: true,
          dotColor: '#ff6347',
        };
      });

      setMarkedDates(marks);
      setTasksByDate(tempTasks);
    };

    fetchTasks();
  }, []);

  return (
    <View style={styles.container}>
      <Calendar
        theme={{
          backgroundColor: '#a2abab4a',
          calendarBackground: '#1c2526',
          textSectionTitleColor: '#b0bec5', //day names (Sun, Mon, etc.)
          selectedDayBackgroundColor: '#ffbf00ff', 
          selectedDayTextColor: '#ffffff',
          todayTextColor: '#9677f0', 
          dayTextColor: '#eceff1', 
          textDisabledColor: '#607d8b', //inactive days
          arrowColor: '#9677f0',
          monthTextColor: '#9677f0',
          textDayFontWeight: '400',
          textMonthFontWeight: '600',
          textDayHeaderFontWeight: '500',
        }}
        markedDates={{
          ...markedDates,
          [selectedDate]: {
            selected: true,
            ...markedDates[selectedDate],
          },
        }}
        onDayPress={(day) => {
          setSelectedDate(day.dateString);
        }}
      />

      <Text style={styles.heading}>Tasks on {selectedDate || '...'}</Text>
      <FlatList
      
        data={tasksByDate[selectedDate] || []}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <Text style={styles.taskText}>📝 {item.text}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#0f0f0f'
  },
  heading: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 10,
    color: '#ffffff', 
  },
  taskItem: {
    backgroundColor: '#2a2a2a', 
    padding: 10,
    borderRadius: 8,
    marginBottom: 5,
  },
  taskText: {
    fontSize: 16,
    color: '#eceff1', 
  },
});