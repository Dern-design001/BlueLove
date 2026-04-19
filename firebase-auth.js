import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
    getAuth,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyAfD_zEwj66WftJ1ueALHdmJ4Tn6QsPcjc",
    authDomain: "bluelove-bebd0.firebaseapp.com",
    projectId: "bluelove-bebd0",
    storageBucket: "bluelove-bebd0.firebasestorage.app",
    messagingSenderId: "46102811795",
    appId: "1:46102811795:web:96a73c37af34c937d06966"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const ADMIN_EMAIL = 'bluelove.bracelets.96@gmail.com';

// Auth state listener
onAuthStateChanged(auth, (user) => {
    window.currentUser = user || null;

    if (user && user.email === ADMIN_EMAIL) {
        window.isAdmin = true;
        localStorage.setItem('bluelove_admin', 'true');
    } else {
        window.isAdmin = false;
        localStorage.removeItem('bluelove_admin');
    }

    if (typeof updateAdminUI === 'function') updateAdminUI();
    if (typeof updateGuestUI === 'function') updateGuestUI();
});

// Admin email/password login
window.firebaseLogin = async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password);
};

// Guest Google login
window.firebaseGoogleLogin = async () => {
    await signInWithPopup(auth, googleProvider);
};

// Guest email/password login
window.firebaseGuestLogin = async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password);
};

window.firebaseLogout = async () => {
    await signOut(auth);
};
