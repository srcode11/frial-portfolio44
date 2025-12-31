// firebase-config.js - الإصدار الجديد (Modular)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

// إعدادات Firebase الخاصة بك
const firebaseConfig = {
  apiKey: "AIzaSyDLJPdy0F4W6iqkUCnKw1jc2CCeGNe5cBU",
  authDomain: "teacher-portfolio-fryal.firebaseapp.com",
  projectId: "teacher-portfolio-fryal",
  storageBucket: "teacher-portfolio-fryal.firebasestorage.app",
  messagingSenderId: "1054582250352",
  appId: "1:1054582250352:web:0fbb6f5a8c2763ffcc4db5",
  measurementId: "G-74HC2DH4YP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// جعل المتغيرات متاحة عالمياً
window.firebaseApp = app;
window.firebaseAuth = auth;
window.firebaseDb = db;
window.firebaseStorage = storage;

console.log("Firebase initialized successfully!");