import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';
import type { Task } from '../types';
import { updateTask, getTasks } from './storage';

// Check if running on native platform
const isNative = Capacitor.isNativePlatform();

// Initialize notifications - request permission
export const initializeNotifications = async (): Promise<void> => {
  if (isNative) {
    try {
      const permission = await LocalNotifications.requestPermissions();
      console.log('Notification permission:', permission.display);
      
      // Set up notification listeners
      LocalNotifications.addListener('localNotificationReceived', (notification) => {
        console.log('Notification received:', notification);
      });
      
      LocalNotifications.addListener('localNotificationActionPerformed', (notification) => {
        console.log('Notification action:', notification);
      });
    } catch (error) {
      console.log('Notification init error:', error);
    }
  } else {
    // Web fallback
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  }
};

// Schedule notification for a task
export const scheduleTaskNotification = async (task: Task): Promise<void> => {
  if (!task.dueDate || !task.dueTime || task.completed) return;
  
  const taskDateTime = new Date(`${task.dueDate}T${task.dueTime}`);
  if (isNaN(taskDateTime.getTime())) return;
  
  const now = new Date();
  if (taskDateTime <= now) return; // Don't schedule past notifications
  
  const priorityEmoji = { 'high': '🔴', 'medium': '🟡', 'low': '🟢' };
  const emoji = priorityEmoji[task.priority] || '📝';
  
  if (isNative) {
    try {
      // Cancel existing notifications for this task
      await cancelTaskNotifications(task.id);
      
      const notifications = [];
      
      // 5 minutes before notification
      const fiveMinBefore = new Date(taskDateTime.getTime() - 5 * 60 * 1000);
      if (fiveMinBefore > now) {
        notifications.push({
          id: hashCode(`${task.id}-5min`),
          title: '⏰ Tasker Reminder',
          body: `${emoji} ${task.title} - Starting in 5 minutes!`,
          schedule: { at: fiveMinBefore },
          sound: 'default',
          smallIcon: 'ic_notification',
          largeIcon: 'ic_launcher',
          channelId: 'tasker-reminders',
          extra: { taskId: task.id, type: '5min' }
        });
      }
      
      // Exact time notification
      notifications.push({
        id: hashCode(`${task.id}-ontime`),
        title: '🚨 Tasker Alert',
        body: `${emoji} ${task.title} - Time is NOW!`,
        schedule: { at: taskDateTime },
        sound: 'default',
        smallIcon: 'ic_notification',
        largeIcon: 'ic_launcher',
        channelId: 'tasker-alerts',
        extra: { taskId: task.id, type: 'ontime' }
      });
      
      if (notifications.length > 0) {
        await LocalNotifications.schedule({ notifications });
        console.log('Scheduled notifications for:', task.title);
      }
    } catch (error) {
      console.log('Schedule notification error:', error);
    }
  }
};

// Cancel notifications for a task
export const cancelTaskNotifications = async (taskId: string): Promise<void> => {
  if (isNative) {
    try {
      const pending = await LocalNotifications.getPending();
      const toCancel = pending.notifications.filter(n => 
        n.extra?.taskId === taskId
      );
      if (toCancel.length > 0) {
        await LocalNotifications.cancel({ notifications: toCancel });
      }
    } catch (error) {
      console.log('Cancel notification error:', error);
    }
  }
};

// Schedule all task notifications
export const scheduleAllNotifications = async (): Promise<void> => {
  const tasks = getTasks();
  for (const task of tasks) {
    if (!task.completed) {
      await scheduleTaskNotification(task);
    }
  }
};

// Create notification channels (Android)
export const createNotificationChannels = async (): Promise<void> => {
  if (isNative) {
    try {
      await LocalNotifications.createChannel({
        id: 'tasker-reminders',
        name: 'Task Reminders',
        description: '5 minute reminder before tasks',
        importance: 4,
        visibility: 1,
        sound: 'default',
        vibration: true,
      });
      
      await LocalNotifications.createChannel({
        id: 'tasker-alerts',
        name: 'Task Alerts',
        description: 'Alerts when task time arrives',
        importance: 5,
        visibility: 1,
        sound: 'default',
        vibration: true,
      });
    } catch (error) {
      console.log('Create channel error:', error);
    }
  }
};

// Simple hash function for generating notification IDs
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

// Legacy web notification support (fallback)
export const checkAndNotifyTasks = (tasks: Task[]): void => {
  if (isNative) return; // Use scheduled notifications on native
  
  const now = new Date();
  
  tasks.forEach(task => {
    if (!task.completed && task.dueDate && task.dueTime) {
      try {
        const taskDateTime = new Date(`${task.dueDate}T${task.dueTime}`);
        if (isNaN(taskDateTime.getTime())) return;
        
        const minutesBefore = (taskDateTime.getTime() - now.getTime()) / 60000;
        
        if (!task.notified5min && minutesBefore > 3 && minutesBefore <= 6) {
          sendWebNotification(task, '5min');
          updateTask(task.id, { notified5min: true });
        }
        
        if (!task.notifiedOnTime && minutesBefore > -2 && minutesBefore <= 1) {
          sendWebNotification(task, 'ontime');
          updateTask(task.id, { notifiedOnTime: true, notified: true });
        }
      } catch (error) {
        console.log('Error checking task:', task.id);
      }
    }
  });
};

const sendWebNotification = (task: Task, type: '5min' | 'ontime'): void => {
  const priorityEmoji = { 'high': '🔴', 'medium': '🟡', 'low': '🟢' };
  const emoji = priorityEmoji[task.priority] || '📝';
  
  const title = type === '5min' ? '⏰ Tasker Reminder' : '🚨 Tasker Alert';
  const body = type === '5min'
    ? `${emoji} ${task.title} - Starting in 5 minutes!`
    : `${emoji} ${task.title} - Time is NOW!`;
  
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, { body });
  }
};

export const requestNotificationPermission = initializeNotifications;
