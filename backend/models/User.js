const { getDB } = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  constructor(data) {
    this.username = data.username;
    this.password = data.password;
    this.role = data.role;
    this.name = data.name;
    this.email = data.email;
    this.department = data.department;
    this.position = data.position;
    this.salary = data.salary;
    this.isActive = data.isActive !== undefined ? data.isActive : true;
  }

  // Hash password before saving
  async hashPassword() {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  // Verify password
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // Save user to database
  async save() {
    const db = getDB();
    const result = await db.collection('users').insertOne({
      ...this,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return result;
  }

  // Find user by email
  static async findByEmail(email) {
    const db = getDB();
    return await db.collection('users').findOne({ email });
  }

  // Get all users with pagination
  static async findAllPaginated(skip = 0, limit = 10, sort = { createdAt: -1 }) {
    const db = getDB();
    return await db.collection('users').find({}).sort(sort).skip(skip).limit(limit).toArray();
  }

  // Count total employees
  static async countEmployees() {
    const db = getDB();
    return await db.collection('users').countDocuments({ role: 'employee' });
  }

  // Find user by ID
  static async findById(id) {
    const db = getDB();
    const { ObjectId } = require('mongodb');
    return await db.collection('users').findOne({ _id: new ObjectId(id) });
  }

  // Get all users (admin only)
  static async findAll() {
    const db = getDB();
    return await db.collection('users').find({}).toArray();
  }

  // Update user
  static async updateById(id, updateData) {
    const db = getDB();
    const { ObjectId } = require('mongodb');

    return await db.collection('users').updateOne(
      { _id: new ObjectId(id) },
      {
        $set: { ...updateData, updatedAt: new Date() }
      }
    );
  }
}

module.exports = User;