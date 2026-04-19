import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    updateProfile,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
    getFirestore,
    doc,
    setDoc,
    collection,
    addDoc,
    query,
    orderBy,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

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
const db = getFirestore(app);
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

// Listen for real-time content changes from Firestore
const contentRef = doc(db, 'site', 'content');
onSnapshot(contentRef, (snapshot) => {
    if (snapshot.exists()) {
        const content = snapshot.data();
        Object.keys(content).forEach(id => {
            const el = document.getElementById(id);
            if (el) el.innerText = content[id];
        });
    }
});

// Listen for real-time product changes from Firestore
const productsRef = doc(db, 'site', 'products');
onSnapshot(productsRef, (snapshot) => {
    if (snapshot.exists()) {
        const data = snapshot.data();
        if (data.list && Array.isArray(data.list) && data.list.length > 0) {
            if (typeof window.onProductsUpdate === 'function') {
                window.onProductsUpdate(data.list);
            }
        }
    }
});

// Save page content to Firestore (admin only)
window.saveContentToFirestore = async () => {
    const content = {};
    document.querySelectorAll('[id^="edit-"]').forEach(el => {
        content[el.id] = el.innerText;
    });
    await setDoc(contentRef, content);
};

// Save products to Firestore (admin only)
window.saveProductsToFirestore = async (productList) => {
    await setDoc(productsRef, { list: productList });
};

// Reviews - real-time listener
const reviewsRef = collection(db, 'reviews');
const reviewsQuery = query(reviewsRef, orderBy('timestamp', 'desc'));
onSnapshot(reviewsQuery, (snapshot) => {
    const reviews = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    if (typeof window.onReviewsUpdate === 'function') window.onReviewsUpdate(reviews);
});

// Submit a review
window.submitReview = async (rating, text) => {
    const user = window.currentUser;
    if (!user) throw new Error('Not logged in');
    await addDoc(reviewsRef, {
        name: user.displayName || user.email.split('@')[0],
        email: user.email,
        rating,
        text,
        timestamp: Date.now()
    });
};

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

// Sign up
window.firebaseSignUp = async (name, email, password) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: name });
};

window.firebaseLogout = async () => {
    await signOut(auth);
};
