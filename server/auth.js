import admin from 'firebase-admin';
import session from 'express-session';
import { storage } from './storage.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firebase Admin SDK
let serviceAccount;
try {
  const serviceAccountPath = path.resolve(__dirname, '../firebase-service-account.json');
  serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} catch (error) {
  console.error('Error loading Firebase service account key:', error);
  console.error('Firebase Admin SDK not initialized. Authentication will not work correctly.');
  // Exit or throw an error if the service account key is not properly configured
  // For now, we'll proceed but authentication won't work correctly.
}

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  return session({
    secret: process.env.SESSION_SECRET || 'a-secret-key', // Use a strong secret in production
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      maxAge: sessionTtl,
    },
  });
}

export async function setupAuth(app) {
  app.use(getSession());
  app.use(async (req, res, next) => {
    const idToken = req.headers.authorization?.split('Bearer ')[1];
    if (idToken) {
      try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        req.user = decodedToken;
        
        // Upsert user into storage (Firebase Realtime Database)
        await storage.upsertUser({
          id: decodedToken.uid,
          email: decodedToken.email,
          firstName: decodedToken.name ? decodedToken.name.split(' ')[0] : '',
          lastName: decodedToken.name ? decodedToken.name.split(' ').slice(1).join(' ') : '',
          profileImageUrl: decodedToken.picture || '',
        });

      } catch (error) {
        console.error('Error verifying Firebase ID token:', error);
        req.user = null;
      }
    } else {
      req.user = null;
    }
    next();
  });
}

export const isAuthenticated = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

export const isAdmin = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const dbUser = await storage.getUser(req.user.uid);
    if (dbUser?.isAdmin) {
      next();
    } else {
      res.status(403).json({ message: 'Forbidden - Admin access required' });
    }
  } catch (error) {
    console.error('Error checking admin status:', error);
    res.status(500).json({ message: 'Failed to check admin status' });
  }
};