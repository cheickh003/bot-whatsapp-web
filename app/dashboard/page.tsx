'use client';

import { useEffect, useState } from 'react';
import { databases, DATABASE_ID, COLLECTIONS } from '@/lib/appwrite';
import { Query } from 'appwrite';

interface DashboardStats {
  totalConversations: number;
  totalMessages: number;
  activeReservations: number;
  openTickets: number;
  todayMessages: number;
  newUsers: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalConversations: 0,
    totalMessages: 0,
    activeReservations: 0,
    openTickets: 0,
    todayMessages: 0,
    newUsers: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Fetch conversations
      const conversations = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.CONVERSATIONS,
        [Query.limit(1000)]
      );
      
      // Fetch today's messages
      const messages = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.MESSAGES,
        [
          Query.greaterThanEqual('$createdAt', today.toISOString()),
          Query.limit(1000)
        ]
      );
      
      // Fetch active reservations
      const reservations = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.RESERVATIONS,
        [
          Query.equal('status', 'confirmed'),
          Query.limit(100)
        ]
      );
      
      // Fetch open tickets
      const tickets = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.TICKETS,
        [
          Query.notEqual('status', 'closed'),
          Query.limit(100)
        ]
      );
      
      // Count new users (conversations created today)
      const newUsersCount = conversations.documents.filter(conv => {
        const createdAt = new Date(conv.$createdAt);
        return createdAt >= today;
      }).length;
      
      setStats({
        totalConversations: conversations.total,
        totalMessages: messages.total,
        activeReservations: reservations.total,
        openTickets: tickets.total,
        todayMessages: messages.total,
        newUsers: newUsersCount,
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Conversations totales',
      value: stats.totalConversations,
      icon: '💬',
      color: 'bg-blue-500',
    },
    {
      title: 'Messages aujourd\\'hui',
      value: stats.todayMessages,
      icon: '📨',
      color: 'bg-green-500',
    },
    {
      title: 'Réservations actives',
      value: stats.activeReservations,
      icon: '📅',
      color: 'bg-yellow-500',
    },
    {
      title: 'Tickets ouverts',
      value: stats.openTickets,
      icon: '🎫',
      color: 'bg-red-500',
    },
    {
      title: 'Nouveaux utilisateurs',
      value: stats.newUsers,
      icon: '👥',
      color: 'bg-purple-500',
    },
    {
      title: 'Messages totaux',
      value: stats.totalMessages,
      icon: '📊',
      color: 'bg-indigo-500',
    },
  ];

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Tableau de bord</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className={`${stat.color} bg-opacity-20 rounded-full p-3`}>
                <span className="text-2xl">{stat.icon}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Activité récente</h2>
        <p className="text-gray-600">
          Les graphiques et l&apos;historique détaillé seront ajoutés prochainement.
        </p>
      </div>
    </div>
  );
}