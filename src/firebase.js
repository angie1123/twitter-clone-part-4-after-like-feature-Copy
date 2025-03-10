// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBAcpGJWWEUmVi9ot7eq_7N2-AaBRuHGuA",
  authDomain: "twitter-app-89c7d.firebaseapp.com",
  projectId: "twitter-app-89c7d",
  storageBucket: "twitter-app-89c7d.appspot.com",
  messagingSenderId: "947730897810",
  appId: "1:947730897810:web:06932981badd2f55c1bf4b"
};


// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage=getStorage(app)
