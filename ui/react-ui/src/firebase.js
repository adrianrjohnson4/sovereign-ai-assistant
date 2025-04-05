import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAOuTlN5PqfPeEfz-zkZ2zf4v5HOOvRBQE",
    authDomain: "sovereignagent-9241b.firebaseapp.com",
    projectId: "sovereignagent-9241b",
    storageBucket: "sovereignagent-9241b.firebasestorage.app",
    messagingSenderId: "881487591645",
    appId: "1:881487591645:web:3995010d351b0fed088334"
}

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)