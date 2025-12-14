import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { TaskForm } from './components/TaskForm';
import { TaskList } from './components/TaskList';
import { CategoryManager } from './components/CategoryManager';
import { getTasks, getCategories } from './utils/storage';
import { 
  checkAndNotifyTasks, 
  initializeNotifications,
  createNotificationChannels,
  scheduleAllNotifications 
} from './utils/capacitorNotifications';
import type { Task } from './types';
import './App.css';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    // Initialize app
    const initApp = async () => {
      // Load initial data
      const loadedTasks = getTasks();
      const loadedCategories = getCategories();
      setTasks(loadedTasks);
      setCategories(loadedCategories);
      
      // Initialize Capacitor notifications
      await createNotificationChannels();
      await initializeNotifications();
      await scheduleAllNotifications();
    };
    
    initApp();
  }, []);

  useEffect(() => {
    // Check for notifications every minute (web fallback)
    const interval = setInterval(() => {
      const currentTasks = getTasks();
      checkAndNotifyTasks(currentTasks);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleTaskAdded = () => {
    const updated = getTasks();
    setTasks(updated);
    setRefreshKey(prev => prev + 1);
  };

  const handleTaskUpdated = () => {
    const updated = getTasks();
    setTasks(updated);
    setRefreshKey(prev => prev + 1);
  };

  const handleCategoryAdded = () => {
    const updated = getCategories();
    setCategories(updated);
  };

  return (
    <div className="app-container">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#2d2d2d',
            color: '#e0e0e0',
            border: '1px solid #404040',
          },
        }}
      />
      
      <header className="app-header">
        <div className="header-content">
          <img src={import.meta.env.BASE_URL + "applogo.jpeg"} alt="Tasker Logo" className="header-logo" />
          <h1 className="app-title">Tasker</h1>
          <p className="app-subtitle">Track all your tasks and never miss a deadline</p>
        </div>
      </header>

      <main className="app-main">
        <div className="app-content">
          <TaskForm
            onTaskAdded={handleTaskAdded}
            categories={categories}
          />
          
          <TaskList
            key={refreshKey}
            tasks={tasks}
            categories={categories}
            onTaskUpdated={handleTaskUpdated}
          />
        </div>
      </main>

      <CategoryManager
        categories={categories}
        onCategoryAdded={handleCategoryAdded}
      />

      <footer className="app-footer">
        <p>✨ Built with care to help you stay organized</p>
      </footer>
    </div>
  );
}

export default App;
