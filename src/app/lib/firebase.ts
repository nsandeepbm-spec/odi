import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  EmailAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  reauthenticateWithCredential,
  updatePassword,
  updateProfile,
  signOut,
  type User as FirebaseUser,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyAue5l3KnQL5NAMjwYihAwzj5N37QRNm5E',
  authDomain: 'odi-studio-b1e45.firebaseapp.com',
  projectId: 'odi-studio-b1e45',
  storageBucket: 'odi-studio-b1e45.firebasestorage.app',
  messagingSenderId: '453089148191',
  appId: '1:453089148191:web:18028ab085e22cd207842a',
  measurementId: 'G-GTNJHWWM7P',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export function signInWithGoogle() {
  return signInWithPopup(auth, googleProvider);
}

export function signInWithEmail(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function registerWithEmail(fullName: string, email: string, password: string) {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(credential.user, { displayName: fullName });
  return credential;
}

export function logout() {
  return signOut(auth);
}

/**
 * Sends Firebase's password-reset email. Passwords live only in Firebase Auth —
 * never in our DB. Safe for existing users (same UID after reset).
 */
export function sendPasswordReset(email: string) {
  return sendPasswordResetEmail(auth, email.trim());
}

/** True if this Firebase account has an email/password credential (not Google-only). */
export function hasEmailPasswordProvider(user: FirebaseUser | null | undefined): boolean {
  return !!user?.providerData.some((p) => p.providerId === 'password');
}

/**
 * Change password for a signed-in email/password user.
 * Re-authenticates with the current password first (Firebase requirement).
 * Password is updated in Firebase Auth only — never written to our DB.
 */
export async function changePassword(currentPassword: string, newPassword: string) {
  const user = auth.currentUser;
  if (!user?.email) {
    throw Object.assign(new Error('Not signed in'), { code: 'auth/missing-email' });
  }
  if (!hasEmailPasswordProvider(user)) {
    throw Object.assign(new Error('No password on this account'), {
      code: 'auth/operation-not-allowed',
    });
  }
  const credential = EmailAuthProvider.credential(user.email, currentPassword);
  await reauthenticateWithCredential(user, credential);
  await updatePassword(user, newPassword);
}

/** Friendly messages for the Firebase auth error codes users actually hit. */
export function authErrorMessage(err: unknown): string {
  const code = (err as { code?: string })?.code ?? '';
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Incorrect email or password.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists. Try signing in.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    case 'auth/invalid-email':
      return 'That email address looks invalid.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait a moment and try again.';
    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
      return 'Google sign-in was cancelled.';
    case 'auth/network-request-failed':
      return 'Network error. Check your connection and try again.';
    case 'auth/missing-email':
      return 'Enter your email address.';
    case 'auth/requires-recent-login':
      return 'For security, sign out and sign in again, then try changing your password.';
    case 'auth/operation-not-allowed':
      return 'This account uses Google sign-in and has no password to change.';
    default:
      return 'Something went wrong. Please try again.';
  }
}
