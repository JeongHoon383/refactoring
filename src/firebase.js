import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCNy5TzKYJKZOF0zVL3qiGkib_oYfkXHd8",
  authDomain: "test-app-4c27e.firebaseapp.com",
  projectId: "test-app-4c27e",
  storageBucket: "test-app-4c27e.appspot.com",
  messagingSenderId: "520156293682",
  appId: "1:520156293682:web:a3835ec2d7ec883a5f6a2b",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
