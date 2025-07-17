// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAXFgOqV-TAodroZu-33cJT74fLuD-JFZQ",
  authDomain: "todo-app-c1600.firebaseapp.com",
  projectId: "todo-app-c1600",
  storageBucket: "todo-app-c1600.firebasestorage.app",
  messagingSenderId: "87290202475",
  appId: "1:87290202475:web:bed2421d7277962e53642e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };