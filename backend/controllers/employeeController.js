const User = require('../models/User');

const getAllEmployees = async (req, res) => {
  try {
    const employees = await User.findAll();

    // Filter out admin users and return only employees
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

    res.json({
      success: true,
      data: employeeList
    });

  } catch (error) {
    console.error('Get employees error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

const createEmployee = async (req, res) => {
  try {
    const { name, email, department, position, salary } = req.body;

    // Check if employee with this email already exists
    const existingUser = await User.findByUsername(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Employee with this email already exists'
      });
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

    res.status(201).json({
      success: true,
      message: 'Employee created successfully',
      data: {
        id: employee._id ? employee._id.toString() : '',
        name: employee.name,
        email: employee.email,
        department: employee.department,
        position: employee.position,
        salary: employee.salary,
        status: 'Active'
      }
    });

  } catch (error) {
    console.error('Create employee error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, department, position, salary, status } = req.body;

    const updateData = {
      name,
      email,
      department,
      position,
      salary: parseFloat(salary) || 0,
      isActive: status === 'Active'
    };

    const result = await User.updateById(id, updateData);

    if (result.modifiedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    res.json({
      success: true,
      message: 'Employee updated successfully'
    });

  } catch (error) {
    console.error('Update employee error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    // Hard delete - permanently remove from database
    const { ObjectId } = require('mongodb');
    const db = require('../models/User').getDB ? require('../models/User').getDB() : require('../config/database').getDB();

    const result = await db.collection('users').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    res.json({
      success: true,
      message: 'Employee permanently deleted successfully'
    });

  } catch (error) {
    console.error('Delete employee error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await User.findById(id);

    if (!employee || employee.role !== 'employee') {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

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

  } catch (error) {
    console.error('Get employee error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  getAllEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeeById
};