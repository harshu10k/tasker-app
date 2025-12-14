import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Register Service Worker for background notifications
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register(
        import.meta.env.BASE_URL + 'sw.js',
        { scope: import.meta.env.BASE_URL }
      );
      console.log('Service Worker registered:', registration.scope);
      
      // Request notification permission
      if ('Notification' in window && Notification.permission === 'default') {
        const permission = await Notification.requestPermission();
        console.log('Notification permission:', permission);
      }
    } catch (error) {
      console.log('Service Worker registration failed:', error);
    }
  });
  
  // Listen for messages from Service Worker
  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data.type === 'GET_TASKS') {
      const tasks = localStorage.getItem('tasker_tasks');
      event.ports[0].postMessage({ tasks: tasks ? JSON.parse(tasks) : [] });
    }
    
    if (event.data.type === 'UPDATE_TASK_NOTIFICATION') {
      const tasks = localStorage.getItem('tasker_tasks');
      if (tasks) {
        const parsedTasks = JSON.parse(tasks);
        const taskIndex = parsedTasks.findIndex((t: any) => t.id === event.data.taskId);
        if (taskIndex !== -1) {
          parsedTasks[taskIndex][event.data.field] = true;
          localStorage.setItem('tasker_tasks', JSON.stringify(parsedTasks));
        }
      }
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
