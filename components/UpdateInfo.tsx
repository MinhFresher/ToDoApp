import { useState } from "react";
import { Button, TextInput, View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";

import { updateProfile } from 'firebase/auth';
import { auth } from "@/firebaseConfig";

export default function EditForm() {
  const [newName, setNewName] = useState('');
  const [updating, setUpdating] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const handleSave = async () => {
    if (!newName.trim()) return;
    setUpdating(true);
    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: newName.trim(),
        });
        alert('✅ Name updated!');
        setNewName('');
        setModalVisible(false);
      }
    } catch (err) {
      console.error('Failed to update name:', err);
      alert('❌ Failed to update name');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <>
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.editButtonText}>✏️</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Change Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter new name"
              value={newName}
              onChangeText={setNewName}
              placeholderTextColor={'#787777ff'}
            />
            <View style={styles.buttonGroup}>
              <Button title="Cancel" onPress={() => setModalVisible(false)} />
              <Button
                title={updating ? 'Updating...' : 'Save'}
                onPress={handleSave}
              />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  editButton: {
    backgroundColor: '#fffeff1e',
    padding: 5,
    borderRadius: 8,
    alignSelf: 'center',
  },
  editButtonText: {
    fontSize: 15
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.51)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#242424ff',
    padding: 25,
    borderRadius: 5,
    width: '85%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: 'white'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ffffffff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    color: 'white'
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
