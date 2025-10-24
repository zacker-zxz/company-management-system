const Task = require('../models/Task');
const User = require('../models/User');

const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.findAll();

    // Get user details for assigned users
    const tasksWithUsers = await Promise.all(
      tasks.map(async (task) => {
        const assignedUser = await User.findById(task.assignedTo);
        const assignedByUser = await User.findById(task.assignedBy);

        return {
          id: task._id.toString(),
          title: task.title,
          description: task.description,
          assignee: assignedUser ? assignedUser.name : 'Unknown',
          assignedBy: assignedByUser ? assignedByUser.name : 'Unknown',
          priority: task.priority,
          status: task.status,
          deadline: task.deadline,
          progress: task.progress,
          createdAt: task.createdAt
        };
      })
    );

    res.json({
      success: true,
      data: tasksWithUsers
    });

  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

const createTask = async (req, res) => {
  try {
    const { title, description, assignedTo, priority, deadline } = req.body;
    const assignedBy = req.user.userId; // From JWT middleware

    // Validate required fields
    if (!title || !assignedTo) {
      return res.status(400).json({
        success: false,
        message: 'Title and assigned user are required'
      });
    }

    // Check if assigned user exists
    const assignedUser = await User.findById(assignedTo);
    if (!assignedUser) {
      return res.status(404).json({
        success: false,
        message: 'Assigned user not found'
      });
    }

    const taskData = {
      title,
      description: description || '',
      assignedTo,
      assignedBy,
      priority: priority || 'Medium',
      status: 'Pending',
      deadline: deadline ? new Date(deadline) : null,
      progress: 0,
      isActive: true
    };

    const task = new Task(taskData);
    await task.save();

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: {
        id: task._id ? task._id.toString() : '',
        title: task.title,
        description: task.description,
        assignee: assignedUser.name,
        priority: task.priority,
        status: task.status,
        deadline: task.deadline
      }
    });

  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, assignedTo, priority, status, deadline, progress } = req.body;

    const updateData = {};
    if (title) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (assignedTo) updateData.assignedTo = assignedTo;
    if (priority) updateData.priority = priority;
    if (status) updateData.status = status;
    if (deadline !== undefined) updateData.deadline = deadline ? new Date(deadline) : null;
    if (progress !== undefined) updateData.progress = progress;

    const result = await Task.updateById(id, updateData);

    if (result.modifiedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.json({
      success: true,
      message: 'Task updated successfully'
    });

  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await Task.deleteById(id);

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.json({
      success: true,
      message: 'Task deleted successfully'
    });

  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    const assignedUser = await User.findById(task.assignedTo);
    const assignedByUser = await User.findById(task.assignedBy);

    res.json({
      success: true,
      data: {
        id: task._id.toString(),
        title: task.title,
        description: task.description,
        assignee: assignedUser ? assignedUser.name : 'Unknown',
        assignedBy: assignedByUser ? assignedByUser.name : 'Unknown',
        priority: task.priority,
        status: task.status,
        deadline: task.deadline,
        progress: task.progress,
        createdAt: task.createdAt
      }
    });

  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

const getUserTasks = async (req, res) => {
  try {
    const userId = req.user.userId; // From JWT middleware
    const tasks = await Task.findByUserId(userId);

    const tasksWithDetails = tasks.map(task => ({
      id: task._id.toString(),
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
      deadline: task.deadline,
      progress: task.progress,
      createdAt: task.createdAt
    }));

    res.json({
      success: true,
      data: tasksWithDetails
    });

  } catch (error) {
    console.error('Get user tasks error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
  getTaskById,
  getUserTasks
};