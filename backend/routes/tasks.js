const express = require('express');
const router = express.Router();
const {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
  getTaskById,
  getUserTasks
} = require('../controllers/taskController');
const { authenticate, requireAdmin } = require('../middleware/auth');

// GET /api/tasks/user - Get current user's tasks (for employees)
router.get('/user', authenticate, getUserTasks);

// All other task routes require authentication and admin role
router.use(authenticate);
router.use(requireAdmin);

// GET /api/tasks - Get all tasks
router.get('/', getAllTasks);

// POST /api/tasks - Create new task
router.post('/', createTask);

// GET /api/tasks/:id - Get task by ID
router.get('/:id', getTaskById);

// PUT /api/tasks/:id - Update task
router.put('/:id', updateTask);

// DELETE /api/tasks/:id - Delete task
router.delete('/:id', deleteTask);

module.exports = router;