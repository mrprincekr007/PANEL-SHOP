import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut, signInWithEmailAndPassword, setPersistence, browserLocalPersistence, browserSessionPersistence } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { getDatabase, ref, onValue, get, push, set, update, remove, runTransaction, serverTimestamp, query, limitToLast } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js";

const app = initializeApp({
    apiKey: "AIzaSyAl1VxbJ4kV-JIeKNrzvE8ypDcYQawAR44",
    authDomain: "prince-1a57b.firebaseapp.com",
    databaseURL: "https://prince-1a57b-default-rtdb.firebaseio.com",
    projectId: "prince-1a57b",
    storageBucket: "prince-1a57b.firebasestorage.app",
    messagingSenderId: "239746744940",
    appId: "1:239746744940:web:3e5dc237ee70857a8f0e49",
    measurementId: "G-4FHFGCVVM5"
});

const auth = getAuth(app);
const db = getDatabase(app);

const ADMIN_UID = "rOlsx6LYYYXPYLkueN2UmviaB8O2";
const ADMIN_UIDS = ["rOlsx6LYYYXPYLkueN2UmviaB8O2", "Uihw1ggsosW7q6swBTYrVbHDEk63"];

export async function isAdmin(uid) {
    if (ADMIN_UIDS.includes(uid)) return true;
    try {
        const snap = await get(ref(db, `admins/${uid}`));
        return snap.exists();
    } catch {
        return false;
    }
}

export function genStock(count) {
    count = Math.max(0, parseInt(count) || 0);
    if (count <= 0) return null;
    const alpha = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    const keys = [];
    for (let i = 0; i < count; i++) {
        const arr = new Uint8Array(5);
        crypto.getRandomValues(arr);
        keys.push("NEXUS-" + Array.from(arr).map(b => alpha[b % 32]).join(""));
    }
    return keys;
}

export { app, auth, db, ref, onValue, get, push, set, update, remove, runTransaction, serverTimestamp, query, limitToLast, signInWithEmailAndPassword, signOut, onAuthStateChanged, setPersistence, browserLocalPersistence, browserSessionPersistence, ADMIN_UID, ADMIN_UIDS };
