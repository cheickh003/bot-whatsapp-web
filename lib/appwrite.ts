import { Client, Account, Databases, Storage, Teams } from 'appwrite';

const client = new Client();

client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || '')
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '');

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const teams = new Teams(client);

// Database IDs
export const DATABASE_ID = process.env.DATABASE_ID || 'whatsapp_chatbot_db';

// Collection IDs
export const COLLECTIONS = {
  CONVERSATIONS: process.env.CONVERSATIONS_COLLECTION_ID || 'conversations',
  MESSAGES: process.env.MESSAGES_COLLECTION_ID || 'messages',
  RESERVATIONS: 'reservations',
  TICKETS: 'tickets',
  PROJECTS: 'projects',
  REMINDERS: 'reminders',
  DAILY_REPORTS: 'daily_reports',
  ADMIN_MESSAGES: 'admin_messages',
  SCHEDULED_MESSAGES: 'scheduled_messages',
  ADMIN_SECURITY: 'admin_security',
  ADMIN_USERS: 'admin_users',
  USER_NOTES: 'user_notes',
  USER_DOCUMENTS: 'user_documents',
};

// Appwrite client for server-side operations
export function getServerClient() {
  const serverClient = new Client();
  
  serverClient
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || '')
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '')
    .setKey(process.env.APPWRITE_API_KEY || '');
    
  return {
    client: serverClient,
    databases: new Databases(serverClient),
    storage: new Storage(serverClient),
    account: new Account(serverClient),
    teams: new Teams(serverClient),
  };
}