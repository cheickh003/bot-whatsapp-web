// Conversation types
export interface Conversation {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  chatId: string;
  phoneNumber: string;
  userName?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  messageCount: number;
  status: 'active' | 'archived';
}

// Message types
export interface Message {
  $id: string;
  $createdAt: string;
  conversationId: string;
  chatId: string;
  from: string;
  body: string;
  timestamp: string;
  type: 'text' | 'image' | 'document' | 'audio' | 'video';
  isFromBot: boolean;
  mediaUrl?: string;
}

// Reservation types
export interface Reservation {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  phoneNumber: string;
  userName: string;
  terrainType: 'football' | 'basketball';
  date: string;
  time: string;
  duration: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  totalPrice: number;
  notes?: string;
}

// Ticket types
export interface Ticket {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  phoneNumber: string;
  userName: string;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  assignedTo?: string;
}

// Admin types
export interface AdminUser {
  $id: string;
  $createdAt: string;
  phoneNumber: string;
  name: string;
  isActive: boolean;
  permissions: string[];
  lastLogin?: string;
}

// Daily Report types
export interface DailyReport {
  $id: string;
  $createdAt: string;
  date: string;
  totalMessages: number;
  totalUsers: number;
  newUsers: number;
  reservations: number;
  tickets: number;
  aiRequests: number;
  errors: number;
  summary: string;
}