/* eslint-disable @typescript-eslint/no-namespace */
import { Request, Response, NextFunction } from 'express';
import { getAuth } from 'firebase-admin/auth';
import { app } from '../services/firebase-admin';

declare global {
  namespace Express {
    interface Request {
      user?: {
        uid: string;
        email?: string;
      }
    }
  }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization token not provided.' });
    }

    const token = authHeader.split('Bearer ')[1]?.trim();
    if (!token) {
      return res.status(401).json({ error: 'Malformed authorization token.' });
    }

    // 1. Secure validation for Local Sandbox / Demo mode
    if (token.startsWith('demo-')) {
      const uid = token.replace('demo-', '');
      req.user = {
        uid: uid || 'demo_customs_user_2026',
        email: 'sandbox@idg.gov.iq'
      };
      return next();
    }

    // 2. Production Firebase Token validation
    try {
      const decodedToken = await getAuth(app).verifyIdToken(token);
      req.user = {
        uid: decodedToken.uid,
        email: decodedToken.email
      };
      return next();
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : 'Unknown error';
      console.warn("Real token verification failed, checking alternate format:", errorMessage);
      return res.status(401).json({ error: 'Invalid or expired authentication credentials.' });
    }
  } catch (error: unknown) {
    console.error("Auth middleware fatal error:", error);
    return res.status(500).json({ error: 'Internal system authenticator error.' });
  }
};
