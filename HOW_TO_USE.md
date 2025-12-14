# How To Use The Task Manager App

## Step 1: Start The App

Open PowerShell and run:

```powershell
cd "c:\Users\ACER\Downloads\tasker app"
npm run dev
```

Wait for it to say:
```
Local: http://localhost:5173/
```

## Step 2: Open In Browser

Go to: http://localhost:5173/

You'll see the app with:
- A title at the top
- "Add New Task" button
- Task list area (empty at first)
- Settings icon at bottom right

---

## How To Add A Task

### Click "Add New Task" Button

This opens a form with:
- Task Title (required)
- Description (optional)
- Date selector
- Time selector
- Priority dropdown
- Category dropdown

### Fill In The Form

**Task Title (Required):**
- Type what you need to do
- Example: "Buy groceries"

**Description (Optional):**
- Add more details
- Example: "Milk, eggs, bread"

**Date (Required):**
- Click the date field
- Pick a date from calendar

**Time (Required):**
- Click the time field
- Enter time like 10:30

**Priority:**
- Choose: Low / Medium / High
- Red = High (urgent)
- Yellow = Medium
- Green = Low

**Category:**
- Choose: Work / Personal / Health / Shopping
- Or create new category

### Click "Add Task"

Task appears in the list!

---

## How To Manage Tasks

### See All Your Tasks

Tasks show as cards with:
- Task name with priority color
- Category badge
- Description
- Date and time
- Circle (empty or checked)
- Delete button

### Mark Task As Done

Click the **empty circle** next to task.

It becomes:
- Green checkmark
- Text gets line through it
- Shows as "completed"

### Unmark Task (Not Done)

Click the **green checkmark** again.

Task goes back to incomplete.

### Delete A Task

Click the **trash icon** on right side.

Confirm deletion when asked.

---

## How To Filter Tasks

Click filter buttons at top:

**Pending** - Only unfinished tasks
**Today** - Only today's tasks
**High Priority** - Only urgent tasks
**Completed** - Only finished tasks
**All** - Show everything

---

## How To Search Tasks

Type in **search box** at top:
- "Buy" - shows all tasks with "Buy"
- "meeting" - shows all meetings
- Filters as you type

---

## How To Use Categories

### Create New Category

1. Click **tag icon** at bottom right
2. Enter category name
3. Click a color (8 colors available)
4. Click "Add Category"

### Delete Category

1. Open category manager (tag icon)
2. Find the category
3. Click the X button next to it
4. Done!

---

## How Notifications Work

### First Time Setup

When you open app:
- Browser asks: "Allow notifications?"
- Click "Allow"
- Now you'll get reminders!

### When You Get Notified

5 minutes before task time:
- Desktop notification appears
- In-app toast message shows
- Both show task name and time

### Important Priority Levels

- Red notification = High priority task
- Yellow notification = Medium priority
- Green notification = Low priority

---

## Daily Workflow

### Morning

1. Open app at http://localhost:5173/
2. Click "Today" filter
3. See all today's tasks
4. Priority: focus on Red tasks first

### During Day

- When notification comes, do the task
- After done, click the circle to mark complete
- See green checkmark

### Evening

1. Click "Completed" filter
2. See what you finished today
3. Feel good about progress!

### Planning Tomorrow

1. Click "Add New Task"
2. Set date for tomorrow
3. Add time
4. Choose category
5. Add task

---

## Tips For Best Use

### 1. Set Correct Time
- Notification comes 5 min before
- So set task for 10:00 = alert at 9:55
- That gives you time to prepare

### 2. Use Categories
- Organize by work/personal/health
- Makes filtering easier
- Find tasks faster

### 3. Set Priority Correctly
- High = must do today
- Medium = should do
- Low = can wait
- Focus on High first

### 4. Add Description
- Write details in description
- Remember context later
- Example: "Call John about meeting tomorrow"

### 5. Check App Daily
- See what's pending
- Get motivated by completed tasks
- Plan what's coming

---

## Common Actions

### I Want To See Only Pending Tasks
Click: **Pending** button

### I Want To See Only Today
Click: **Today** button

### I Want To See Everything
Click: **All** button

### I Want To Find A Specific Task
Use: **Search box** at top

### I Forgot What A Task Is About
Click: **The task card** to see full description

### I Don't Want This Task Anymore
Click: **Trash icon** and confirm

### I Completed A Task
Click: **The circle** next to it

### I Need To Undo - Task Not Done Yet
Click: **The green checkmark** again

---

## Colors Explained

Priority Colors:
- Green circle = Low priority
- Yellow circle = Medium priority
- Red circle = High priority

Category Colors:
- Each category has own color
- Helps visual organization
- You can customize colors

---

## What Happens To My Data?

- Everything saved in your browser
- Not sent to any server
- No one else can see it
- Works completely offline
- Data stays even after closing app

---

## Troubleshooting

### App won't load
- Check if npm run dev is still running
- Restart: Ctrl+C then npm run dev again
- Clear browser cache

### Can't see tasks
- Check filter settings
- Click "All" to see everything
- Try searching

### Notifications not working
- Check browser permission
- Click notification permission dialog
- Select "Allow"

### Lost data
- Don't use Private/Incognito mode
- Use normal browser mode
- Data will be saved

### App is slow
- Delete old completed tasks
- Browser might have too much data
- Close other tabs

---

## Keyboard Shortcuts

(None currently, but you can use Tab to navigate)

---

## Mobile Use

The app works great on phone:
- All buttons are big
- Easy to tap
- Perfect for checking tasks on go
- Add tasks from anywhere

---

## Export Data

Currently no export feature.

But you can:
- Take screenshot of tasks
- Copy paste from app
- Data is safe locally

---

## Get Started Now!

1. Run: npm run dev
2. Open: http://localhost:5173/
3. Click: "Add New Task"
4. Add: Your first task
5. Enjoy: Managing your tasks!

---

## Questions?

- Read: QUICK_GUIDE.md (more detailed)
- Read: README_NEW.md (technical info)
- Check: Source code in src/ folder

---

That's it! You're ready to use the app!

Start adding tasks and never forget anything again!
