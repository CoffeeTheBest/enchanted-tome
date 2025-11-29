import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBMX58eCME8K2czb2Jwoqmx3_3Bmbl9-fk",
  authDomain: "enchanted-tome-d55c2.firebaseapp.com",
  databaseURL: "https://enchanted-tome-d55c2-default-rtdb.firebaseio.com",
  projectId: "enchanted-tome-d55c2",
  storageBucket: "enchanted-tome-d55c2.firebasestorage.app",
  messagingSenderId: "1058339881104",
  appId: "1:1058339881104:web:13afc4860754459b845815",
  measurementId: "G-MSXXBFZ96P"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
