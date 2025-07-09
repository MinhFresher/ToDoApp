import { View, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';

type TaskProps = {
    text: string
    checked: boolean
    setChecked: () => void
    onDelete: () => void
}

export default function Task (props: TaskProps) {
  const { text, checked, setChecked, onDelete: deleteTodo } = props;

  return (
    <View style={[styles.taskWrapper, checked && styles.taskChecked]}>
      <TouchableOpacity onPress={setChecked}>
        <Image
          style={styles.tinyIcon}
          source={
            checked
              ? require('../assets/images/Checkedbox.png')
              : require('../assets/images/Checkbox.png')
          }
        />
      </TouchableOpacity>

      <Text style={[styles.task, checked && styles.taskTextChecked]}>
        {text}
      </Text>

      <TouchableOpacity onPress={deleteTodo}>
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
