import { View, TouchableOpacity, Text, StyleSheet, Image, Alert, TextInput } from 'react-native';
import { db } from '../firebaseConfig'; 
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useState } from 'react';

type TaskProps = {
  id: string; // Firestore document ID
  text: string;
  checked: boolean;
  setChecked: () => void; // Kept for compatibility, not used
  onDelete: () => void; // Kept for compatibility, not used
};

export default function Task(props: TaskProps) {
  const { id, text, checked } = props;
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(text);

  const taskRef = doc(db, 'todos', id);

  const handleChecked = async () => {
    try {
      await updateDoc(taskRef, { checked: !checked });
    } catch (error) {
      console.error('Error updating task: ', error);
    }
  };

  const handleEdit = async () => {
    try {
      await updateDoc(taskRef, { text: editedText });
    } catch (error: any) {
      Alert.alert('Error', `Failed to update todo: ${error}`);
    }
  };

  const handleDelete = async () => {
    try {
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

      {isEditing ? (
        <TextInput
          style={[styles.task, { flex: 1, color: 'white', borderBottomWidth: 1, borderBottomColor: 'gray' }]}
          value={editedText}
          onChangeText={setEditedText}
          autoFocus
        />
      ) : (
        <Text style={[styles.task, checked && styles.taskTextChecked]}>{text}</Text>
      )}

      {isEditing ? (
        <TouchableOpacity
          onPress={() => {
            handleEdit();
            setIsEditing(false);
          }}
        >
          <Text style={styles.saveButton}>Save</Text>
        </TouchableOpacity>
      ) : (
        <>
          <TouchableOpacity onPress={() => setIsEditing(true)}>
            <Text style={styles.editButton}>✏️</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete}>
            <Text style={styles.deleteButton}>x</Text>
          </TouchableOpacity>
        </>
      )}
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
  editButton: {
    fontSize: 18,
    color: '#ccc',
    marginHorizontal: 5,
  },
  saveButton: {
    fontSize: 18,
    color: '#4CAF50',
    marginHorizontal: 5,
  },
});