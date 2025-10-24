const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// In-memory database (in production, use MongoDB/PostgreSQL)
let tasks = [
  { id: 1, title: 'Learn Node.js', completed: false, createdAt: new Date().toISOString() },
  { id: 2, title: 'Build REST API', completed: true, createdAt: new Date().toISOString() }
];

let nextId = 3;

// Routes

// GET all tasks
app.get('/api/tasks', (req, res) => {
  res.json({ success: true, data: tasks });
});

// GET single task
app.get('/api/tasks/:id', (req, res) => {
  const task = tasks.find(t => t.id === parseInt(req.params.id));
  if (!task) {
    return res.status(404).json({ success: false, message: 'Task not found' });
  }
  res.json({ success: true, data: task });
});

// POST create new task
app.post('/api/tasks', (req, res) => {
  const { title } = req.body;
  
  if (!title || title.trim() === '') {
    return res.status(400).json({ success: false, message: 'Title is required' });
  }
  
  const newTask = {
    id: nextId++,
    title: title.trim(),
    completed: false,
    createdAt: new Date().toISOString()
  };
  
  tasks.push(newTask);
  res.status(201).json({ success: true, data: newTask });
});

// PUT update task
app.put('/api/tasks/:id', (req, res) => {
  const taskIndex = tasks.findIndex(t => t.id === parseInt(req.params.id));
  
  if (taskIndex === -1) {
    return res.status(404).json({ success: false, message: 'Task not found' });
  }
  
  const { title, completed } = req.body;
  
  if (title !== undefined) tasks[taskIndex].title = title;
  if (completed !== undefined) tasks[taskIndex].completed = completed;
  
  res.json({ success: true, data: tasks[taskIndex] });
});

// DELETE task
app.delete('/api/tasks/:id', (req, res) => {
  const taskIndex = tasks.findIndex(t => t.id === parseInt(req.params.id));
  
  if (taskIndex === -1) {
    return res.status(404).json({ success: false, message: 'Task not found' });
  }
  
  tasks.splice(taskIndex, 1);
  res.json({ success: true, message: 'Task deleted' });
});

// Statistics endpoint
app.get('/api/stats', (req, res) => {
  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    pending: tasks.filter(t => !t.completed).length
  };
  res.json({ success: true, data: stats });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});