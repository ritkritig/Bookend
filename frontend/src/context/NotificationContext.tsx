import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { NotificationItem } from '../types';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

interface NotificationContextType {
  notifications: NotificationItem[];
  unreadCount: number;
  refreshNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
  activeToast: NotificationItem | null;
  dismissToast: () => void;
  triggerToast: (title: string, message: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [activeToast, setActiveToast] = useState<NotificationItem | null>(null);

  const refreshNotifications = useCallback(async () => {
    if (!user) return;
    try {
      const items = await api.getNotifications();
      // If a brand new unread notification arrived, show toast
      if (items.length > 0 && notifications.length > 0) {
        const newest = items[0];
        if (!newest.isRead && newest.id !== notifications[0]?.id) {
          setActiveToast(newest);
        }
      }
      setNotifications(items);
    } catch {
      // Ignored if service warming up
    }
  }, [user, notifications]);

  useEffect(() => {
    refreshNotifications();
    const interval = setInterval(refreshNotifications, 8000);
    return () => clearInterval(interval);
  }, [refreshNotifications]);

  const markAsRead = async (id: string) => {
    await api.markNotificationRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllRead = async () => {
    await api.markAllNotificationsRead();
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const dismissToast = () => setActiveToast(null);

  const triggerToast = (title: string, message: string) => {
    setActiveToast({
      id: `toast_${Date.now()}`,
      user_id: user?.id || 'demo',
      type: 'system',
      title,
      message,
      isRead: false,
      created_at: new Date().toISOString()
    });
    // Auto-dismiss toast after 4 seconds
    setTimeout(() => {
      setActiveToast(prev => prev && prev.title === title ? null : prev);
    }, 4000);
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      refreshNotifications,
      markAsRead,
      markAllRead,
      activeToast,
      dismissToast,
      triggerToast
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within a NotificationProvider');
  return ctx;
};
