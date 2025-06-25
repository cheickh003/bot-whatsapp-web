import { getServerClient } from './appwrite';
import { COLLECTIONS, DATABASE_ID } from './appwrite';
import { Query } from 'appwrite';

export interface AuthSession {
  phoneNumber: string;
  name: string;
  sessionId: string;
  expiresAt: string;
}

export async function verifyAdminPin(phoneNumber: string, pin: string): Promise<boolean> {
  // In production, this should check against the admin_security collection
  // For now, we'll use a simple check
  const validPin = process.env.ADMIN_PIN || '1234';
  return pin === validPin;
}

export async function createAdminSession(phoneNumber: string): Promise<AuthSession> {
  const { databases } = getServerClient();
  
  try {
    // Get admin user details
    const users = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.ADMIN_USERS,
      [Query.equal('phoneNumber', phoneNumber)]
    );
    
    if (users.documents.length === 0) {
      throw new Error('Admin user not found');
    }
    
    const user = users.documents[0];
    const sessionId = generateSessionId();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours
    
    // Store session in admin_security collection
    await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.ADMIN_SECURITY,
      'unique()',
      {
        phoneNumber,
        sessionId,
        action: 'web_login',
        timestamp: new Date().toISOString(),
        expiresAt,
      }
    );
    
    return {
      phoneNumber,
      name: user.name,
      sessionId,
      expiresAt,
    };
  } catch (error) {
    console.error('Error creating admin session:', error);
    throw error;
  }
}

export async function validateSession(sessionId: string): Promise<AuthSession | null> {
  const { databases } = getServerClient();
  
  try {
    const sessions = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.ADMIN_SECURITY,
      [
        Query.equal('sessionId', sessionId),
        Query.equal('action', 'web_login'),
        Query.greaterThan('expiresAt', new Date().toISOString()),
      ]
    );
    
    if (sessions.documents.length === 0) {
      return null;
    }
    
    const session = sessions.documents[0];
    
    // Get user details
    const users = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.ADMIN_USERS,
      [Query.equal('phoneNumber', session.phoneNumber)]
    );
    
    if (users.documents.length === 0) {
      return null;
    }
    
    const user = users.documents[0];
    
    return {
      phoneNumber: session.phoneNumber,
      name: user.name,
      sessionId: session.sessionId,
      expiresAt: session.expiresAt,
    };
  } catch (error) {
    console.error('Error validating session:', error);
    return null;
  }
}

function generateSessionId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}