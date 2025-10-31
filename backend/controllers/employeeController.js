const User = require('../models/User');
const { catchAsync } = require('../utils/asyncHandler');
const { NotFoundError, ConflictError, ValidationError } = require('../utils/errorHandler');
const { logger } = require('../utils/logger');
const cacheService = require('../services/cacheService');

const getAllEmployees = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sort = req.query.sort || 'createdAt';
  const order = req.query.order === 'asc' ? 1 : -1;
  const skip = (page - 1) * limit;

  // Build cache key
  const cacheKey = `employees:${page}:${limit}:${sort}:${order}`;
  
  // Try to get from cache first
  const cachedData = cacheService.get('user', cacheKey);
  if (cachedData) {
    logger.info('Employees retrieved from cache', {
      userId: req.user.userId,
      page,
      limit,
      cacheKey
    });
    
    return res.json(cachedData);
  }

  // Build sort object
  const sortObj = { [sort]: order };

  // Get employees with pagination
  const employees = await User.findAllPaginated(skip, limit, sortObj);
  const total = await User.countEmployees();

  // Filter out admin users and format response
  const employeeList = employees
    .filter(user => user.role === 'employee')
    .map(employee => ({
      id: employee._id.toString(),
      name: employee.name,
      email: employee.email,
      department: employee.department,
      position: employee.position,
      salary: employee.salary,
      status: employee.isActive ? 'Active' : 'Inactive',
      joinDate: employee.createdAt
    }));

  const responseData = {
    success: true,
    data: employeeList,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };

  // Cache the response
  cacheService.set('user', cacheKey, responseData, 300); // 5 minutes

  logger.info('Employees retrieved from database', {
    userId: req.user.userId,
    page,
    limit,
    total,
    returned: employeeList.length
  });

  res.json(responseData);
});

const createEmployee = catchAsync(async (req, res) => {
  const { name, email, department, position, salary } = req.body;

  // Check if employee with this email already exists
  const existingUser = await User.findByEmail(email);
  if (existingUser) {
    throw new ConflictError('Employee with this email already exists');
  }

  // Generate username from email
  const username = email.split('@')[0];

  // Create employee data
  const employeeData = {
    username,
    password: 'TempPass123!', // Temporary password
    role: 'employee',
    name,
    email,
    department,
    position,
    salary: parseFloat(salary) || 0,
    isActive: true
  };

  const employee = new User(employeeData);

  // Hash password
  await employee.hashPassword();

  // Save to database
  await employee.save();

  // Invalidate related caches
  cacheService.clear('user'); // Clear user list caches
  cacheService.clear('stats'); // Clear dashboard stats

  logger.info('Employee created', {
    userId: req.user.userId,
    employeeId: employee._id.toString(),
    employeeName: employee.name,
    employeeEmail: employee.email
  });

  res.status(201).json({
    success: true,
    message: 'Employee created successfully',
    data: {
      id: employee._id.toString(),
      name: employee.name,
      email: employee.email,
      department: employee.department,
      position: employee.position,
      salary: employee.salary,
      status: 'Active'
    }
  });
});

const updateEmployee = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { name, email, department, position, salary, status } = req.body;

  // Check if employee exists
  const existingEmployee = await User.findById(id);
  if (!existingEmployee || existingEmployee.role !== 'employee') {
    throw new NotFoundError('Employee');
  }

  // Check if email is being changed and if it conflicts
  if (email && email !== existingEmployee.email) {
    const emailExists = await User.findByEmail(email);
    if (emailExists) {
      throw new ConflictError('Employee with this email already exists');
    }
  }

  const updateData = {};
  if (name) updateData.name = name;
  if (email) updateData.email = email;
  if (department) updateData.department = department;
  if (position) updateData.position = position;
  if (salary !== undefined) updateData.salary = parseFloat(salary) || 0;
  if (status !== undefined) updateData.isActive = status === 'Active';

  const result = await User.updateById(id, updateData);

  if (result.modifiedCount === 0) {
    throw new NotFoundError('Employee');
  }

  logger.info('Employee updated', {
    userId: req.user.userId,
    employeeId: id,
    updatedFields: Object.keys(updateData)
  });

  res.json({
    success: true,
    message: 'Employee updated successfully'
  });
});

const deleteEmployee = catchAsync(async (req, res) => {
  const { id } = req.params;

  // Check if employee exists
  const existingEmployee = await User.findById(id);
  if (!existingEmployee || existingEmployee.role !== 'employee') {
    throw new NotFoundError('Employee');
  }

  // Hard delete - permanently remove from database
  const { ObjectId } = require('mongodb');
  const db = require('../config/database').getDB();

  const result = await db.collection('users').deleteOne({ _id: new ObjectId(id) });

  if (result.deletedCount === 0) {
    throw new NotFoundError('Employee');
  }

  logger.info('Employee deleted', {
    userId: req.user.userId,
    employeeId: id,
    employeeName: existingEmployee.name
  });

  res.json({
    success: true,
    message: 'Employee permanently deleted successfully'
  });
});

const getEmployeeById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const employee = await User.findById(id);

  if (!employee || employee.role !== 'employee') {
    throw new NotFoundError('Employee');
  }

  logger.info('Employee retrieved by ID', {
    userId: req.user.userId,
    employeeId: id
  });

  res.json({
    success: true,
    data: {
      id: employee._id.toString(),
      name: employee.name,
      email: employee.email,
      department: employee.department,
      position: employee.position,
      salary: employee.salary,
      status: employee.isActive ? 'Active' : 'Inactive',
      joinDate: employee.createdAt
    }
  });
});

module.exports = {
  getAllEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeeById
};