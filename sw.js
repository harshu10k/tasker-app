// Tasker Service Worker - PWA Ready
const CACHE_NAME = 'tasker-cache-v2';

// Files to cache for offline support
const urlsToCache = [
  '/tasker-app/',
  '/tasker-app/index.html',
  '/tasker-app/manifest.json',
  '/tasker-app/logo-192.png',
  '/tasker-app/logo-512.png'
];

// Install event - cache files
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching files');
        return cache.addAll(urlsToCache);
      })
      .catch((err) => console.log('Cache error:', err))
  );
  self.skipWaiting();
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activated');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: Clearing old cache');
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
  startNotificationChecker();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request)
          .then((fetchResponse) => {
            if (event.request.method === 'GET') {
              const responseClone = fetchResponse.clone();
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseClone);
                });
            }
            return fetchResponse;
          });
      })
      .catch(() => {
        if (event.request.destination === 'document') {
          return caches.match('/tasker-app/index.html');
        }
      })
  );
});

// Push notification event
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'Tasker Reminder';
  const options = {
    body: data.body || 'You have a task reminder!',
    icon: '/tasker-app/logo-192.png',
    badge: '/tasker-app/logo-192.png',
    vibrate: [200, 100, 200],
    data: data
  };
  
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes('tasker-app') && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/tasker-app/');
      }
    })
  );
});

// Background sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'check-tasks') {
    event.waitUntil(checkAndNotify());
  }
});

// Periodic notification checker
function startNotificationChecker() {
  setInterval(() => checkAndNotify(), 30000);
  checkAndNotify();
}

// Check for notifications
async function checkAndNotify() {
  try {
    const allClients = await self.clients.matchAll();
    if (allClients.length === 0) return;
    
    const tasks = await new Promise((resolve) => {
      const messageChannel = new MessageChannel();
      messageChannel.port1.onmessage = (event) => {
        resolve(event.data.tasks || []);
      };
      allClients[0].postMessage({ type: 'GET_TASKS' }, [messageChannel.port2]);
      setTimeout(() => resolve([]), 1000);
    });
    
    const now = new Date();
    
    tasks.forEach(task => {
      if (!task.completed && task.dueDate && task.dueTime) {
        const taskDateTime = new Date(`${task.dueDate}T${task.dueTime}`);
        if (isNaN(taskDateTime.getTime())) return;
        
        const minutesBefore = (taskDateTime.getTime() - now.getTime()) / 60000;
        
        if (!task.notified5min && minutesBefore > 3 && minutesBefore <= 6) {
          showTaskNotification(task, '5min');
          notifyClient(task.id, 'notified5min');
        }
        
        if (!task.notifiedOnTime && minutesBefore > -2 && minutesBefore <= 1) {
          showTaskNotification(task, 'ontime');
          notifyClient(task.id, 'notifiedOnTime');
        }
      }
    });
  } catch (error) {
    console.log('Notification check error:', error);
  }
}

// Show notification
function showTaskNotification(task, type) {
  const emoji = { 'high': '🔴', 'medium': '🟡', 'low': '🟢' };
  const title = type === '5min' ? '⏰ Tasker Reminder' : '🚨 Tasker Alert';
  const body = type === '5min' 
    ? `${emoji[task.priority] || '📝'} ${task.title} - Starting in 5 minutes!`
    : `${emoji[task.priority] || '📝'} ${task.title} - Time is NOW!`;
  
  self.registration.showNotification(title, {
    body, 
    icon: '/tasker-app/logo-192.png',
    badge: '/tasker-app/logo-192.png',
    tag: `${task.id}-${type}`,
    requireInteraction: type === 'ontime',
    vibrate: [200, 100, 200]
  });
}

// Notify client
async function notifyClient(taskId, field) {
  const allClients = await self.clients.matchAll();
  allClients.forEach(client => {
    client.postMessage({ type: 'UPDATE_TASK_NOTIFICATION', taskId, field });
  });
}

// Message listener
self.addEventListener('message', (event) => {
  if (event.data.type === 'TASKS_UPDATE') {
    checkAndNotify();
  }
});
