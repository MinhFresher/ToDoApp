import { View, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import { db } from '../firebaseConfig'; 
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';

type TaskProps = {
  id: string; // Firestore document ID
  text: string;
  checked: boolean;
  setChecked: () => void; // Kept for compatibility, not used
  onDelete: () => void; // Kept for compatibility, not used
};

export default function Task(props: TaskProps) {
  const { id, text, checked } = props;

  // Toggle task completion in Firestore
  const handleChecked = async () => {
    try {
      const taskRef = doc(db, 'todos', id);
      await updateDoc(taskRef, { checked: !checked });
    } catch (error) {
      console.error('Error updating task: ', error);
    }
  };

  const handleDelete = async () => {
    try {
      const taskRef = doc(db, 'todos', id);
      await deleteDoc(taskRef);
    } catch (error) {
      console.error('Error deleting task: ', error);
    }
  };

  return (
    <View style={[styles.taskWrapper, checked && styles.taskChecked]}>
      <TouchableOpacity onPress={handleChecked}>
        <Image
          style={styles.tinyIcon}
          source={
            checked
              ? require('../assets/images/Checkedbox.png')
              : require('../assets/images/Checkbox.png')
          }
        />
      </TouchableOpacity>

      <Text style={[styles.task, checked && styles.taskTextChecked]}>{text}</Text>

      <TouchableOpacity onPress={handleDelete}>
        <Text style={styles.deleteButton}>x</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  taskWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2b2d',
    borderRadius: 10,
    padding: 12,
    marginVertical: 8,
    marginHorizontal: 20,
  },
  taskChecked: {
    backgroundColor: '#1d1e20',
    borderColor: 'green',
    borderWidth: 1,
  },
  task: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
    marginLeft: 12,
  },
  taskTextChecked: {
    textDecorationLine: 'line-through',
    color: '#aaa',
  },
  tinyIcon: {
    width: 28,
    height: 28,
  },
  deleteButton: {
    marginLeft: 12,
    color: '#ff4d4d',
    fontSize: 20,
    fontWeight: '600',
  },
});