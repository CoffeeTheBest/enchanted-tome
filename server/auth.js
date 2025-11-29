import admin from 'firebase-admin';
import session from 'express-session';
import { storage } from './storage.js';

// Initialize Firebase Admin SDK
if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
  throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY is not set. Please update your .env file');
}

try {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} catch (error) {
  console.error('Error initializing Firebase Admin SDK:', error);
  throw new Error('Failed to initialize Firebase Admin SDK. Please check your FIREBASE_SERVICE_ACCOUNT_KEY in .env');
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
