import { collection, addDoc, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig'

export const addTodo = async (text: string) => {
  const user = auth.currentUser;
  if (!user) return;

  await addDoc(collection(db, 'todos'), {
    uid: user.uid,
    text,
    completed: false,
    createdAt: new Date()
  });
};

export const getTodos = async () => {
  const user = auth.currentUser;
  if (!user) return [];

  const q = query(collection(db, 'todos'), where('uid', '==', user.uid));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const deleteTodo = async (id: string) => {
  await deleteDoc(doc(db, 'todos', id));
};
