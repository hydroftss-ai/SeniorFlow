import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

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
// La caja y los movimientos deben reflejar siempre el estado compartido de
// Firebase. No se habilita persistencia IndexedDB para evitar que una PC
// opere con una copia local vieja de la caja.
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage, firebaseConfig };
