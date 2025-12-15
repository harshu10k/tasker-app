import React from 'react';
import { CheckCircle, Circle, Trash2, Download } from 'lucide-react';
import type { Task } from '../types';
import { updateTask, deleteTask } from '../utils/storage';
import { formatDistanceToNow } from 'date-fns';
import '../styles/TaskCard.css';

interface TaskCardProps {
  task: Task;
  categories: any[];
  onTaskUpdated: () => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, categories, onTaskUpdated }) => {
  const category = categories.find(c => c.id === task.category);
  
  const priorityColors = {
    low: '#4ade80',
    medium: '#facc15',
    high: '#ef4444',
  };

  const handleToggleComplete = () => {
    updateTask(task.id, { completed: !task.completed });
    onTaskUpdated();
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(task.id);
      onTaskUpdated();
    }
  };

  const downloadAttachment = (attachment: any) => {
    const link = document.createElement('a');
    link.href = attachment.data;
    link.download = attachment.name;
    link.click();
  };

  // Safe date parsing with fallback
  const getTaskDateTime = () => {
    try {
      if (!task.dueDate || !task.dueTime) return null;
      const dt = new Date(`${task.dueDate}T${task.dueTime}`);
      return isNaN(dt.getTime()) ? null : dt;
    } catch {
      return null;
    }
  };
  
  const taskDateTime = getTaskDateTime();

  return (
    <div className={`task-card ${task.completed ? 'completed' : ''}`}>
      <div className="task-main">
        <button
          className="task-checkbox-btn"
          onClick={handleToggleComplete}
          title={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
        >
          {task.completed ? (
            <CheckCircle size={28} className="checked-icon" />
          ) : (
            <Circle size={28} className="unchecked-icon" />
          )}
        </button>

        <div className="task-details">
          <div className="task-header">
            <h3 className={task.completed ? 'completed-title' : ''}>
              {task.title}
            </h3>
            {category && (
              <span
                className="category-badge"
                style={{ backgroundColor: category.color }}
              >
                {category.name}
              </span>
            )}
          </div>

          {task.description && (
            <p className="task-description">{task.description}</p>
          )}

          <div className="task-meta">
            <span className="task-date">📅 {task.dueDate || 'No date'}</span>
            <span className="task-time">🕐 {task.dueTime || 'No time'}</span>
            <span 
              className="task-priority"
              style={{ 
                backgroundColor: priorityColors[task.priority as keyof typeof priorityColors] || '#888',
                opacity: 0.8
              }}
            >
              {(task.priority || 'medium').toUpperCase()}
            </span>
            {taskDateTime && (
              <span className="task-relative-time">
                ({formatDistanceToNow(taskDateTime, { addSuffix: true })})
              </span>
            )}
          </div>

          {task.attachments && task.attachments.length > 0 && (
            <div className="attachments-section">
              <h4>📎 Attachments ({task.attachments.length})</h4>
              <div className="attachments-grid">
                {task.attachments.map((att: any) => (
                  <div key={att.id} className="attachment-card">
                    <div className="attachment-name">{att.name}</div>
                    <div className="attachment-size">
                      {(att.size / 1024).toFixed(2)} KB
                    </div>
                    <button
                      className="download-btn"
                      onClick={() => downloadAttachment(att)}
                      title="Download file"
                    >
                      <Download size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <button
        className="task-delete-btn"
        onClick={handleDelete}
        title="Delete task"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
};
