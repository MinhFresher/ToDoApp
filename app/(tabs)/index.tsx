import { Text, View, TextInput, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useState } from 'react'
import Task from "@/components/Task";

type Todo ={
  text: string
  key: number
  checked: boolean
}

export default function Index() {
  const [value, setValue] = useState('')
  const [todos, setTodos] = useState<Todo[]>([])

  const handleAdd = () => {
    if (value.length > 0) {
      setTodos([
        ...todos,
        {
          text: value,
          key: Date.now(),
          checked: false
        }])
      setValue('')
    }
  }

  const handleDelete = (id: number) => {
    setTodos(todos.filter((todo)=> todo.key !== id))
  }

  const handleChecked = (id: number) => {
    setTodos(todos.map((todo) => {
      if(todo.key === id){
        return { ...todo, checked: !todo.checked};
      }
      return todo;
    }))
  }
  
  return (
    <View style={styles.container}>
      <Text style ={{marginTop: '10%', fontSize: 35, textAlign:'center', color: 'white'}}>Today</Text>
      <View  style={styles.textInputForm}>
        <TextInput
          style={styles.textInput}
          onChangeText={(value) => setValue(value)}
          placeholder="Enter your task" placeholderTextColor="lightgray"
          value={value}
        />  

        <TouchableOpacity onPress={() => handleAdd()}>
          <Text style={{fontSize: 30, marginBottom: 5, color: 'white'}}>+</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{width: '100%', paddingHorizontal: 30}}>
        {todos.map((task) => (
          <Task
            text={task.text}
            key={task.key}
            checked={task.checked}
            setChecked={() => handleChecked(task.key)}
            onDelete={() => handleDelete(task.key)}
          />
        ))
        }
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
  tinyIcon:{
    width: 50,
    height: 50
  },
});