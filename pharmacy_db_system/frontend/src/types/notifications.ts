export interface AppNotification {
  id: string | number;
  title: string;
  body: string;
  is_read: boolean;
  type: string;
  created_at: string;
  data?: any;
}