import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyBqONlMbnvBIoRdh4tz4zoJfFDGuyjldxI",
  authDomain: "farmtokitchen-5a72d.firebaseapp.com",
  projectId: "farmtokitchen-5a72d",
  storageBucket: "farmtokitchen-5a72d.firebasestorage.app",
  messagingSenderId: "358391708500",
  appId: "1:358391708500:web:accbec44a8ada1aea926c1"
};

const app = initializeApp(firebaseConfig);

export const auth=getAuth(app)
export const db=getFirestore(app)
export default app

