# Task Manager App - Quick Guide

=====================================================

## Quick Start (5 Minutes)

1. Open PowerShell/Terminal

2. Run these commands:
   ```powershell
   cd "c:\Users\ACER\Downloads\tasker app"
   npm run dev
   ```

3. Open in browser:
   ```
   http://localhost:5173/
```

Done! Your app is ready!

=====================================================

## How To Use The App

### Adding a New Task:
1. Click "Add New Task" button
2. Enter task title (required)
3. Add description (optional)
4. Select date
5. Select time
6. Choose priority (Low, Medium, High)
7. Choose category
8. Click "Add Task"

### Mark Task as Complete:
- Click the empty circle next to the task
- Task will show with a line through it

### Delete a Task:
- Click the trash icon on the right side of task

### Search Tasks:
- Type in the search box at the top
- All matching tasks will appear

### Filter Tasks:

| Filter | Shows |
|--------|-------|
| Pending | Incomplete tasks |
| Today | Only today's tasks |
| High Priority | Important tasks only |
| Completed | Finished tasks |
| All | All tasks |

### Manage Categories:
1. Click the tag icon at bottom right
2. Enter new category name
3. Choose a color
4. Click "Add Category"
5. Click X to delete existing category

### Enable Notifications:
- Browser will ask permission first time you open
- Click "Allow"
- Notifications will come 5 minutes before task time

=====================================================

## Features Overview

### Task Management
- Add new tasks with details
- Mark tasks as complete
- Delete tasks
- Search and filter tasks

### Smart Notifications
- Automatic reminders 5 minutes before task time
- Browser notifications (desktop alerts)
- In-app notifications (toast messages)
- Notifications based on priority level

### Organization
- Create custom categories
- Assign colors to categories
- Filter by categories
- Search by title or description

### Data Security
- All data saved in browser (LocalStorage)
- No server uploads
- 100% private
- Works offline

### Design
- Modern and clean interface
- Mobile responsive
- Fast and smooth experience
- Easy to use

=====================================================

## Color & Priority System

Low Priority: Green
Medium Priority: Yellow
High Priority: Red

=====================================================

## Useful Tips

### Best Practices:
1. Set important tasks to High priority
2. Create categories for organization (Work, Personal, Health, etc.)
3. Set correct time so reminders are accurate
4. Write descriptions to remember details

### Problem Solving:

Problem: App won't load
Solution: Run npm install, then npm run dev

Problem: Notifications not working
Solution: Check browser notification settings

Problem: Can't see task
Solution: Check filter settings (click "All")

Problem: Data disappeared
Solution: Don't use Private/Incognito mode

=====================================================

## Mobile Usage

- App works perfectly on mobile
- All buttons are large and easy to tap
- Touch screen friendly
- Fully responsive design

=====================================================

## Data Storage

- Data is stored in browser (LocalStorage)
- Not stored on any server
- Cannot be seen by anyone else
- Always available even offline

=====================================================

## Supported Features

Working Features:
- Task creation with full details
- Task completion tracking
- Task deletion
- Task search and filtering
- Category management
- Custom colors for categories
- Priority levels
- Time-based reminders
- Browser notifications
- Offline functionality

Future Features:
- Task statistics and analytics
- Recurring tasks
- Calendar view
- Cloud synchronization
- Mobile app
- Task sharing

=====================================================

## Common Questions

Q: Is my data safe?
A: Yes! Data is stored in your browser only. No one else can see it.

Q: Does it work offline?
A: Yes! After loading once, it works completely offline.

Q: How many tasks can I add?
A: Thousands! (Older devices might be slower)

Q: Is it free?
A: Yes! 100% free!

Q: Can I export my data?
A: Not yet, but it may be added in future.

Q: Does it work on mobile?
A: Yes! It's fully mobile-friendly.

=====================================================

## Available Commands

Run development server:
```powershell
npm run dev
```

Build for production:
```powershell
npm run build
```

Preview build:
```powershell
npm run preview
```

Install dependencies:
```powershell
npm install
```

=====================================================

## File Structure

```
src/
├── components/
│   ├── TaskForm.tsx ............ Form to add new tasks
│   ├── TaskCard.tsx ............ Display individual task
│   ├── TaskList.tsx ............ Display all tasks
│   └── CategoryManager.tsx ..... Manage categories
├── types/
│   └── index.ts ................ Data types
├── utils/
│   ├── storage.ts .............. Save/load data
│   └── notifications.ts ........ Send notifications
├── styles/
│   ├── TaskForm.css ............ Form styling
│   ├── TaskCard.css ............ Task card styling
│   ├── TaskList.css ............ Task list styling
│   └── CategoryManager.css ..... Category styling
├── App.tsx ..................... Main app
├── App.css ..................... Main styling
└── index.css ................... Global styles
```

=====================================================

## Technologies Used

- React 18 - UI Framework
- TypeScript - Type safety
- Vite - Fast development
- react-hot-toast - Notifications
- date-fns - Date handling
- lucide-react - Icons

=====================================================

## Troubleshooting

Issue: App shows blank page
Solution: Clear browser cache and reload

Issue: Buttons not responding
Solution: Refresh page with Ctrl+F5

Issue: Notifications appearing as spam
Solution: Add app to notification whitelist

Issue: Tasks loading slowly
Solution: Delete old completed tasks

Issue: Can't add task
Solution: Fill all required fields (title, date, time)

=====================================================

## Next Steps

1. Run: npm run dev
2. Open: http://localhost:5173/
3. Read: START_HERE.md (if you need more info)
4. Add some test tasks
5. Test the notification system
6. Start tracking your daily tasks!

=====================================================

Version: 1.0
Status: Ready to Use
Date: December 5, 2025

Happy Task Managing!
