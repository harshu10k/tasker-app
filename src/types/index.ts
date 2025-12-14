export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  data: string;
  uploadedAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  dueTime: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
  completed: boolean;
  createdAt: Date;
  notified: boolean;
  notified5min?: boolean;  // 5 min before notification sent
  notifiedOnTime?: boolean;  // Exact time notification sent
  attachments: Attachment[];
}

export interface Category {
  id: string;
  name: string;
  color: string;
}
