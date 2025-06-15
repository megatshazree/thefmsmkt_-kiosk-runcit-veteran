import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { getStorage } from 'firebase-admin/storage';

// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

// Initialize Admin SDK only once
let adminApp;

if (!getApps().length) {
  // Service account configuration from environment variables
  const serviceAccount = {
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID || 'thefamousmarket',
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  };

  adminApp = initializeApp({
    credential: cert(serviceAccount),
    projectId: 'thefamousmarket',
    storageBucket: 'thefamousmarket.appspot.com'
  });
} else {
  adminApp = getApps()[0];
}

// Export services
export const adminDb = getFirestore(adminApp);
export const adminAuth = getAuth(adminApp);
export const adminStorage = getStorage(adminApp);

export default adminApp;
