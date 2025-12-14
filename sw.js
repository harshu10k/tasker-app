// Tasker Service Worker for Background Notifications
const CACHE_NAME = 'tasker-v1';
const TASKS_KEY = 'tasker_tasks';

// Install event
self.addEventListener('install', (event) => {
  console.log('Service Worker installed');
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('Service Worker activated');
  event.waitUntil(self.clients.claim());
  // Start checking for notifications
  startNotificationChecker();
});

// Start periodic notification check
function startNotificationChecker() {
  // Check every 30 seconds
  setInterval(() => {
    checkAndNotify();
  }, 30000);
  
  // Also check immediately
  checkAndNotify();
}

// Get tasks from localStorage via client
async function getTasks() {
  const clients = await self.clients.matchAll();
  if (clients.length > 0) {
    // Try to get from client
    return new Promise((resolve) => {
      const messageChannel = new MessageChannel();
      messageChannel.port1.onmessage = (event) => {
        resolve(event.data.tasks || []);
      };
      clients[0].postMessage({ type: 'GET_TASKS' }, [messageChannel.port2]);
      // Timeout after 1 second
      setTimeout(() => resolve([]), 1000);
    });
  }
  return [];
}

// Check tasks and send notifications
async function checkAndNotify() {
  try {
    const tasks = await getTasks();
    const now = new Date();
    
    tasks.forEach(task => {
      if (!task.completed && task.dueDate && task.dueTime) {
        const taskDateTime = new Date(`${task.dueDate}T${task.dueTime}`);
        if (isNaN(taskDateTime.getTime())) return;
        
        const timeDiff = taskDateTime.getTime() - now.getTime();
        const minutesBefore = timeDiff / (60 * 1000);
        
        // 5 minutes before notification
        if (!task.notified5min && minutesBefore > 3 && minutesBefore <= 6) {
          showNotification(task, '5min');
          notifyClient(task.id, 'notified5min');
        }
        
        // Exact time notification
        if (!task.notifiedOnTime && minutesBefore > -2 && minutesBefore <= 1) {
          showNotification(task, 'ontime');
          notifyClient(task.id, 'notifiedOnTime');
        }
      }
    });
  } catch (error) {
    console.log('Notification check error:', error);
  }
}

// Show notification
function showNotification(task, type) {
  const priorityEmoji = {
    'high': '🔴',
    'medium': '🟡', 
    'low': '🟢'
  };
  
  let title, body, tag;
  
  if (type === '5min') {
    title = '⏰ Tasker Reminder';
    body = `${priorityEmoji[task.priority]} ${task.title} - Starting in 5 minutes!`;
    tag = `${task.id}-5min`;
  } else {
    title = '🚨 Tasker Alert';
    body = `${priorityEmoji[task.priority]} ${task.title} - Time is NOW!`;
    tag = `${task.id}-ontime`;
  }
  
  self.registration.showNotification(title, {
    body: body,
    icon: '/tasker-app/applogo.jpeg',
    badge: '/tasker-app/applogo.jpeg',
    tag: tag,
    requireInteraction: type === 'ontime',
    vibrate: [200, 100, 200],
    actions: [
      { action: 'open', title: 'Open App' },
      { action: 'dismiss', title: 'Dismiss' }
    ]
  });
}

// Notify client to update task
async function notifyClient(taskId, field) {
  const clients = await self.clients.matchAll();
  clients.forEach(client => {
    client.postMessage({
      type: 'UPDATE_TASK_NOTIFICATION',
      taskId: taskId,
      field: field
    });
  });
}

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      self.clients.matchAll({ type: 'window' }).then((clientList) => {
        // If app is already open, focus it
        for (const client of clientList) {
          if (client.url.includes('tasker-app') && 'focus' in client) {
            return client.focus();
          }
        }
        // Otherwise open new window
        if (self.clients.openWindow) {
          return self.clients.openWindow('/tasker-app/');
        }
      })
    );
  }
});

// Listen for messages from main app
self.addEventListener('message', (event) => {
  if (event.data.type === 'TASKS_UPDATE') {
    // Tasks have been updated, check notifications
    checkAndNotify();
  }
});
