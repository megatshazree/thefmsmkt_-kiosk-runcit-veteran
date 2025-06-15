import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { getStorage } from 'firebase-admin/storage';

// Initialize Admin SDK only once
let adminApp;

if (!getApps().length) {
  // For production, use environment variables
  const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID || 'thefmsmkt-kiosk-runcit-veteran',
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  };

  adminApp = initializeApp({
    credential: cert(serviceAccount),
    projectId: 'thefmsmkt-kiosk-runcit-veteran',
    storageBucket: 'thefmsmkt-kiosk-runcit-veteran.firebasestorage.app'
  });
} else {
  adminApp = getApps()[0];
}

// Export services
export const adminDb = getFirestore(adminApp);
export const adminAuth = getAuth(adminApp);
export const adminStorage = getStorage(adminApp);

export default adminApp;
