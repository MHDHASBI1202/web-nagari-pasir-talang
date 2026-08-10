// Firebase Configuration — Nagari Pasir Talang
const firebaseConfig = {
  apiKey: "AIzaSyCAJV2ToNBfrbyG3gQuXu6HaC2s-G1oJW4",
  authDomain: "nagari-pasir-talang.firebaseapp.com",
  projectId: "nagari-pasir-talang",
  storageBucket: "nagari-pasir-talang.firebasestorage.app",
  messagingSenderId: "228148829458",
  appId: "1:228148829458:web:3eff470478f8ed9d8767cb"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();