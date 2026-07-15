import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyAOviuXZVTK30e6AUnySCfRoAGg80xan1I",
  authDomain: "seniorflow-92da3.firebaseapp.com",
  projectId: "seniorflow-92da3",
  storageBucket: "seniorflow-92da3.firebasestorage.app",
  messagingSenderId: "946111904101",
  appId: "1:946111904101:web:abd809cd911454520d898c"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage, firebaseConfig };
