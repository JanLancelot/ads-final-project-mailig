// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAKlMeumPhu9bssxigaissGDZ4XjZBWDh8",
  authDomain: "ads-final-project-mailig-2a.firebaseapp.com",
  projectId: "ads-final-project-mailig-2a",
  storageBucket: "ads-final-project-mailig-2a.appspot.com",
  messagingSenderId: "246542612033",
  appId: "1:246542612033:web:0d9576b7cd3714e52df8c0"
};

// Initialize Firebase

export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
