// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAjJKZmZiz8k-qba9traH5xWhKSVvmWbzg",
  authDomain: "fake-store-logs.firebaseapp.com",
  projectId: "fake-store-logs",

  storageBucket: "fake-store-logs.firebasestorage.app",

  messagingSenderId: "341643778950",
  appId: "1:341643778950:web:9b4f6e8a232afd8a036a07",
  measurementId: "G-GKFE0L0XCH",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
