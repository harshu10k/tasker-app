import type { Task } from '../types';

const STORAGE_KEY = 'tasker_tasks';
const CATEGORIES_KEY = 'tasker_categories';

export const getTasks = (): Task[] => {
  const tasks = localStorage.getItem(STORAGE_KEY);
  return tasks ? JSON.parse(tasks) : [];
};

export const saveTasks = (tasks: Task[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

export const addTask = (task: Task): void => {
  const tasks = getTasks();
  tasks.push(task);
  saveTasks(tasks);
};

export const updateTask = (id: string, updatedTask: Partial<Task>): void => {
  const tasks = getTasks();
  const index = tasks.findIndex(t => t.id === id);
  if (index !== -1) {
    tasks[index] = { ...tasks[index], ...updatedTask };
    saveTasks(tasks);
  }
};

export const deleteTask = (id: string): void => {
  const tasks = getTasks();
  const filteredTasks = tasks.filter(t => t.id !== id);
  saveTasks(filteredTasks);
};

export const deleteMultipleTasks = (ids: string[]): void => {
  const tasks = getTasks();
  const filteredTasks = tasks.filter(t => !ids.includes(t.id));
  saveTasks(filteredTasks);
};

export const getCategories = () => {
  const categories = localStorage.getItem(CATEGORIES_KEY);
  return categories ? JSON.parse(categories) : getDefaultCategories();
};

export const saveCategories = (categories: any[]): void => {
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
};

const getDefaultCategories = () => [
  { id: '1', name: 'Work', color: '#FF6B6B' },
  { id: '2', name: 'Personal', color: '#4ECDC4' },
  { id: '3', name: 'Health', color: '#FFE66D' },
  { id: '4', name: 'Shopping', color: '#95E1D3' },
  { id: '5', name: 'Other', color: '#A8E6CF' },
];

export const addCategory = (category: any): void => {
  const categories = getCategories();
  categories.push(category);
  saveCategories(categories);
};
