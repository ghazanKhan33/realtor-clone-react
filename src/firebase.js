// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC_ZF4j02tQ29ywRGV5AvTBG8CHoXZmsu4",
  authDomain: "realtor-clone-react-94ce0.firebaseapp.com",
  projectId: "realtor-clone-react-94ce0",
  storageBucket: "realtor-clone-react-94ce0.appspot.com",
  messagingSenderId: "540688249945",
  appId: "1:540688249945:web:e1d12988a6f5dfcbdc2d48"
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();