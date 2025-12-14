import React, { useState } from 'react';
import { Plus, X, Upload } from 'lucide-react';
import type { Task } from '../types';
import { addTask } from '../utils/storage';
import { scheduleTaskNotification } from '../utils/capacitorNotifications';
import '../styles/TaskForm.css';

interface TaskFormProps {
  onTaskAdded: (task: Task) => void;
  categories: any[];
}

export const TaskForm: React.FC<TaskFormProps> = ({ onTaskAdded, categories }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [category, setCategory] = useState(categories[0]?.id || '');
  const [attachments, setAttachments] = useState<any[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        if (file.size > 10 * 1024 * 1024) {
          alert(`File ${file.name} is too large (max 10MB)`);
          return;
        }
        const reader = new FileReader();
        reader.onload = (event) => {
          const attachment = {
            id: Math.random().toString(36).substr(2, 9),
            name: file.name,
            type: file.type,
            size: file.size,
            data: event.target?.result as string,
            uploadedAt: new Date().toISOString(),
          };
          setAttachments(prev => [...prev, attachment]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(att => att.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert('Please enter a task title');
      return;
    }
    if (!dueDate) {
      alert('Please select a due date');
      return;
    }
    if (!dueTime) {
      alert('Please select a due time');
      return;
    }

    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      title: title.trim(),
      description,
      dueDate,
      dueTime,
      priority,
      category: category || categories[0]?.id || 'other',
      completed: false,
      createdAt: new Date(),
      notified: false,
      attachments,
    };

    addTask(newTask);
    scheduleTaskNotification(newTask); // Schedule notification for new task
    onTaskAdded(newTask);

    setTitle('');
    setDescription('');
    setDueDate('');
    setDueTime('');
    setPriority('medium');
    setCategory(categories[0]?.id || '');
    setAttachments([]);
    setIsOpen(false);
  };

  return (
    <div className="task-form-container">
      <button 
        className="add-task-button"
        onClick={() => setIsOpen(true)}
        title="Add a new task"
      >
        <Plus size={20} />
        <span>Add New Task</span>
      </button>

      {isOpen && (
        <div className="form-modal" onClick={() => setIsOpen(false)}>
          <form className="form-content" onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()}>
            <div className="form-header">
              <h2>Create New Task</h2>
              <button
                type="button"
                className="close-button"
                onClick={() => setIsOpen(false)}
                title="Close"
              >
                <X size={24} />
              </button>
            </div>

            <div className="form-body">
              <div className="form-group">
                <label htmlFor="title">Task Title *</label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="What do you need to do?"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add more details about this task..."
                  rows={3}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="date">Due Date *</label>
                  <input
                    id="date"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="time">Due Time *</label>
                  <input
                    id="time"
                    type="time"
                    value={dueTime}
                    onChange={(e) => setDueTime(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="priority">Priority</label>
                  <select
                    id="priority"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="category">Category</label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="files">Attach Files (Optional)</label>
                <div className="file-upload-wrapper">
                  <input
                    id="files"
                    type="file"
                    onChange={handleFileUpload}
                    multiple
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.txt"
                    className="file-input"
                  />
                  <label htmlFor="files" className="file-upload-label">
                    <Upload size={24} />
                    <span>Click to upload files</span>
                    <small>PDF, Documents, Images (Max 10MB each)</small>
                  </label>
                </div>
              </div>

              {attachments.length > 0 && (
                <div className="attachments-preview">
                  <h4>Attached Files ({attachments.length})</h4>
                  <div className="attachments-list">
                    {attachments.map((att) => (
                      <div key={att.id} className="attachment-item">
                        <div className="attachment-info">
                          <span className="attachment-name">{att.name}</span>
                          <span className="attachment-size">
                            {(att.size / 1024).toFixed(2)} KB
                          </span>
                        </div>
                        <button
                          type="button"
                          className="remove-btn"
                          onClick={() => removeAttachment(att.id)}
                          title="Remove file"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="cancel-button"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </button>
              <button type="submit" className="submit-button">
                Create Task
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
