import api from './axios';
import type {AppNotification} from "../types/notifications"

export const notificationsAPI = {
  // 1. الدالة الخاصة بإرسال توكن فايربيز للباك اند
  updateFcmToken: async (data: { userId: string | number, fcmToken: string }): Promise<any> => {
    // تأكد إن المسار ده متطابق مع الـ Route اللي عملناه في الباك اند
    const response = await api.post<any>('users/update-fcm-token', data);
    return response.data;
  },

  // 2. جلب قائمة الإشعارات الخاصة بالمستخدم (لعرضها في أيقونة الجرس)
  getNotifications: async (): Promise<AppNotification[]> => {
    const response = await api.get<AppNotification[]>('users/notifications');
    return response.data;
  },

  // 3. تحديد إشعار معين كمقروء
  markAsRead: async (notificationId: string | number): Promise<any> => {
    const response = await api.patch<any>(`users/notifications/${notificationId}/read`);
    return response.data;
  },

  // 4. تحديد كل الإشعارات كمقروءة
  markAllAsRead: async (): Promise<any> => {
    const response = await api.patch<any>('users/notifications/mark-all-read');
    return response.data;
  }
};