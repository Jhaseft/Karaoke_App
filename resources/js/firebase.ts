import { initializeApp } from 'firebase/app';
import {
    FacebookAuthProvider,
    GoogleAuthProvider,
    getAuth,
    signInWithPopup,
} from 'firebase/auth';

const firebaseConfig = {
    apiKey: 'AIzaSyDRa8xzYhELet1oQmGIBZ2zZgLCjwZVliw',
    authDomain: 'karaokebar-d8f37.firebaseapp.com',
    projectId: 'karaokebar-d8f37',
    storageBucket: 'karaokebar-d8f37.firebasestorage.app',
    messagingSenderId: '339731604223',
    appId: '1:339731604223:web:d69049d4904585558fa2ca',
    measurementId: 'G-EFYGYTEW4T',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

//Google
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export async function signInWithGoogle(): Promise<string> {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user.getIdToken();
}

//Facebook
const facebookProvider = new FacebookAuthProvider();
facebookProvider.addScope('email');

export async function signInWithFacebook(): Promise<string> {
    const result = await signInWithPopup(auth, facebookProvider);
    return result.user.getIdToken();
}
