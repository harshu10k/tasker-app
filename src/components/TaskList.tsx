import React, { useState, useMemo } from 'react';
import { TaskCard } from './TaskCard';
import type { Task } from '../types';
import '../styles/TaskList.css';

interface TaskListProps {
  tasks: Task[];
  categories: any[];
  onTaskUpdated: () => void;
}

export const TaskList: React.FC<TaskListProps> = ({ tasks, categories, onTaskUpdated }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'pending' | 'completed' | 'today' | 'high'>('all');

  const filteredTasks = useMemo(() => {
    let result = tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
      
      const today = new Date().toISOString().split('T')[0];
      
      switch (filterType) {
        case 'pending':
          return matchesSearch && !task.completed;
        case 'completed':
          return matchesSearch && task.completed;
        case 'today':
          return matchesSearch && task.dueDate === today && !task.completed;
        case 'high':
          return matchesSearch && task.priority === 'high' && !task.completed;
        default:
          return matchesSearch;
      }
    });

    return result.sort((a, b) => {
      const dateA = new Date(`${a.dueDate}T${a.dueTime}`).getTime();
      const dateB = new Date(`${b.dueDate}T${b.dueTime}`).getTime();
      return dateA - dateB;
    });
  }, [tasks, searchTerm, filterType]);

  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => !t.completed).length,
    completed: tasks.filter(t => t.completed).length,
    high: tasks.filter(t => t.priority === 'high' && !t.completed).length,
  };

  return (
    <div className="task-list-section">
      <div className="task-stats">
        <div className="stat-item">
          <span className="stat-label">Total:</span>
          <span className="stat-value">{stats.total}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Pending:</span>
          <span className="stat-value pending">{stats.pending}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Completed:</span>
          <span className="stat-value completed">{stats.completed}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">High Priority:</span>
          <span className="stat-value high">{stats.high}</span>
        </div>
      </div>

      <div className="search-filter-section">
        <input
          type="text"
          className="search-input"
          placeholder="🔍 Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="filter-buttons">
          <button
            className={`filter-btn ${filterType === 'all' ? 'active' : ''}`}
            onClick={() => setFilterType('all')}
          >
            All Tasks
          </button>
          <button
            className={`filter-btn ${filterType === 'pending' ? 'active' : ''}`}
            onClick={() => setFilterType('pending')}
          >
            Pending
          </button>
          <button
            className={`filter-btn ${filterType === 'today' ? 'active' : ''}`}
            onClick={() => setFilterType('today')}
          >
            Today
          </button>
          <button
            className={`filter-btn ${filterType === 'high' ? 'active' : ''}`}
            onClick={() => setFilterType('high')}
          >
            High Priority
          </button>
          <button
            className={`filter-btn ${filterType === 'completed' ? 'active' : ''}`}
            onClick={() => setFilterType('completed')}
          >
            Completed
          </button>
        </div>
      </div>

      <div className="tasks-container">
        {filteredTasks.length > 0 ? (
          <div className="tasks-list">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                categories={categories}
                onTaskUpdated={onTaskUpdated}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No tasks found</h3>
            <p>
              {searchTerm
                ? 'Try different keywords'
                : 'Create your first task to get started!'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
