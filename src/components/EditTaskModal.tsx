import React, { useState, useEffect } from 'react';
import { X, Save, Upload, Trash2 } from 'lucide-react';
import type { Task } from '../types';
import { updateTask } from '../utils/storage';
import { scheduleTaskNotification, cancelTaskNotifications } from '../utils/capacitorNotifications';
import '../styles/EditTaskModal.css';

interface EditTaskModalProps {
  task: Task;
  categories: any[];
  isOpen: boolean;
  onClose: () => void;
  onTaskUpdated: () => void;
}

export const EditTaskModal: React.FC<EditTaskModalProps> = ({
  task,
  categories,
  isOpen,
  onClose,
  onTaskUpdated,
}) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [dueDate, setDueDate] = useState(task.dueDate);
  const [dueTime, setDueTime] = useState(task.dueTime);
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>(task.priority);
  const [category, setCategory] = useState(task.category);
  const [attachments, setAttachments] = useState<any[]>(task.attachments || []);

  useEffect(() => {
    if (isOpen) {
      setTitle(task.title);
      setDescription(task.description);
      setDueDate(task.dueDate);
      setDueTime(task.dueTime);
      setPriority(task.priority);
      setCategory(task.category);
      setAttachments(task.attachments || []);
    }
  }, [isOpen, task]);

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

    // Check if date/time changed to reset notification flags
    const timeChanged = dueDate !== task.dueDate || dueTime !== task.dueTime;
    
    const updatedTask = {
      ...task,
      title: title.trim(),
      description,
      dueDate,
      dueTime,
      priority,
      category,
      attachments,
      // Reset all notification flags if time changed
      ...(timeChanged && {
        notified: false,
        notified5min: false,
        notifiedOnTime: false,
      }),
    };
    
    updateTask(task.id, updatedTask);
    
    // Reschedule notification if time changed
    if (timeChanged) {
      cancelTaskNotifications(task.id);
      scheduleTaskNotification(updatedTask as any);
    }

    onTaskUpdated();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="edit-modal-overlay" onClick={onClose}>
      <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
        <div className="edit-modal-header">
          <h2>✏️ Edit Task</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="edit-form">
          <div className="form-group">
            <label>Task Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title..."
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add task details..."
              className="form-textarea"
              rows={3}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>📅 Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>🕐 Time</label>
              <input
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>⚡ Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
                className="form-select"
              >
                <option value="low">🟢 Low</option>
                <option value="medium">🟡 Medium</option>
                <option value="high">🔴 High</option>
              </select>
            </div>

            <div className="form-group">
              <label>📁 Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="form-select"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>📎 Attachments</label>
            <div className="file-upload-area">
              <input
                type="file"
                id="edit-file-upload"
                multiple
                onChange={handleFileUpload}
                className="file-input"
              />
              <label htmlFor="edit-file-upload" className="file-upload-label">
                <Upload size={20} />
                <span>Add Files</span>
              </label>
            </div>

            {attachments.length > 0 && (
              <div className="attachments-list">
                {attachments.map((att) => (
                  <div key={att.id} className="attachment-item">
                    <span className="attachment-name">{att.name}</span>
                    <span className="attachment-size">
                      {(att.size / 1024).toFixed(1)} KB
                    </span>
                    <button
                      type="button"
                      className="remove-attachment-btn"
                      onClick={() => removeAttachment(att.id)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="save-btn">
              <Save size={18} />
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
