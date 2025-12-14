import type { Task } from '../types';
import { updateTask } from './storage';

// Notify Service Worker about task updates
const notifyServiceWorker = () => {
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({ type: 'TASKS_UPDATE' });
  }
};

export const checkAndNotifyTasks = (tasks: Task[]): void => {
  const now = new Date();
  
  tasks.forEach(task => {
    if (!task.completed && task.dueDate && task.dueTime) {
      try {
        const taskDateTime = new Date(`${task.dueDate}T${task.dueTime}`);
        if (isNaN(taskDateTime.getTime())) return;
        
        const timeDifference = taskDateTime.getTime() - now.getTime();
        const minutesBefore = timeDifference / (60 * 1000);
        
        // Notification 1: 5 minutes before (between 4-6 min window)
        if (!task.notified5min && minutesBefore > 3 && minutesBefore <= 6) {
          sendNotification(task, '5min');
          updateTask(task.id, { notified5min: true });
        }
        
        // Notification 2: Exact time (within 1 minute window - before or after)
        if (!task.notifiedOnTime && minutesBefore > -2 && minutesBefore <= 1) {
          sendNotification(task, 'ontime');
          updateTask(task.id, { notifiedOnTime: true, notified: true });
        }
        
      } catch (error) {
        console.log('Error checking task:', task.id);
      }
    }
  });
  
  // Notify SW about any updates
  notifyServiceWorker();
};

// Send native phone notification (no in-app toast)
const sendNotification = async (task: Task, type: '5min' | 'ontime'): Promise<void> => {
  const priorityEmoji = {
    'high': '🔴',
    'medium': '🟡',
    'low': '🟢'
  };

  let title: string;
  let body: string;
  
  if (type === '5min') {
    title = '⏰ Tasker Reminder';
    body = `${priorityEmoji[task.priority]} ${task.title} - Starting in 5 minutes!`;
  } else {
    title = '🚨 Tasker Alert';
    body = `${priorityEmoji[task.priority]} ${task.title} - Time is NOW!`;
  }

  // Use Service Worker for persistent notification
  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.ready;
    await registration.showNotification(title, {
      body: body,
      icon: '/tasker-app/applogo.jpeg',
      badge: '/tasker-app/applogo.jpeg',
      tag: `${task.id}-${type}`,
      requireInteraction: type === 'ontime',
      vibrate: [200, 100, 200],
      data: { taskId: task.id, type: type }
    } as NotificationOptions);
  } else if ('Notification' in window && Notification.permission === 'granted') {
    // Fallback to regular notification
    new Notification(title, {
      body: body,
      icon: '/tasker-app/applogo.jpeg',
      tag: `${task.id}-${type}`,
    });
  }
};

export const requestNotificationPermission = async (): Promise<void> => {
  if ('Notification' in window && Notification.permission === 'default') {
    try {
      await Notification.requestPermission();
    } catch (error) {
      console.log('Notification permission denied');
    }
  }
};
