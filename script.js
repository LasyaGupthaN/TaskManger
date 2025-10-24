// API Base URL - change this to your backend URL
const API_URL = 'http://localhost:3000/api';

// DOM Elements
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const tasksList = document.getElementById('tasksList');
const loading = document.getElementById('loading');
const emptyState = document.getElementById('emptyState');
const notification = document.getElementById('notification');

// Statistics elements
const statTotal = document.getElementById('stat-total');
const statCompleted = document.getElementById('stat-completed');
const statPending = document.getElementById('stat-pending');

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    loadStats();
});

// Add task on button click
addBtn.addEventListener('click', addTask);

// Add task on Enter key
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

// AJAX Function: Fetch all tasks
async function loadTasks() {
    try {
        loading.style.display = 'block';
        tasksList.innerHTML = '';

        const response = await fetch(`${API_URL}/tasks`);
        const result = await response.json();

        if (result.success) {
            displayTasks(result.data);
        }
    } catch (error) {
        showNotification('Failed to load tasks', 'error');
        console.error('Error:', error);
    } finally {
        loading.style.display = 'none';
    }
}

// AJAX Function: Load statistics
async function loadStats() {
    try {
        const response = await fetch(`${API_URL}/stats`);
        const result = await response.json();

        if (result.success) {
            statTotal.textContent = result.data.total;
            statCompleted.textContent = result.data.completed;
            statPending.textContent = result.data.pending;
        }
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

// AJAX Function: Add new task
async function addTask() {
    const title = taskInput.value.trim();

    if (!title) {
        showNotification('Please enter a task', 'error');
        return;
    }

    try {
        addBtn.disabled = true;

        const response = await fetch(`${API_URL}/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title })
        });

        const result = await response.json();

        if (result.success) {
            taskInput.value = '';
            showNotification('Task added successfully!', 'success');
            loadTasks();
            loadStats();
        } else {
            showNotification(result.message, 'error');
        }
    } catch (error) {
        showNotification('Failed to add task', 'error');
        console.error('Error:', error);
    } finally {
        addBtn.disabled = false;
    }
}

// AJAX Function: Toggle task completion
async function toggleTask(id, completed) {
    try {
        const response = await fetch(`${API_URL}/tasks/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ completed })
        });

        const result = await response.json();

        if (result.success) {
            loadTasks();
            loadStats();
            showNotification('Task updated!', 'success');
        }
    } catch (error) {
        showNotification('Failed to update task', 'error');
        console.error('Error:', error);
    }
}

// AJAX Function: Delete task
async function deleteTask(id) {
    if (!confirm('Are you sure you want to delete this task?')) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/tasks/${id}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (result.success) {
            showNotification('Task deleted!', 'success');
            loadTasks();
            loadStats();
        }
    } catch (error) {
        showNotification('Failed to delete task', 'error');
        console.error('Error:', error);
    }
}

// DOM Manipulation: Display tasks
function displayTasks(tasks) {
    tasksList.innerHTML = '';

    if (tasks.length === 0) {
        emptyState.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';

    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.innerHTML = `
            <input type="checkbox" ${task.completed ? 'checked' : ''} 
                   onchange="toggleTask(${task.id}, this.checked)">
            <div class="task-content">
                <div class="task-title ${task.completed ? 'completed' : ''}">${task.title}</div>
                <div class="task-date">Created: ${new Date(task.createdAt).toLocaleString()}</div>
            </div>
            <div class="task-actions">
                <button class="btn-delete" onclick="deleteTask(${task.id})">Delete</button>
            </div>
        `;
        tasksList.appendChild(li);
    });
}

// DOM Manipulation: Show notification
function showNotification(message, type) {
    notification.textContent = message;
    notification.className = `notification ${type} show`;

    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}