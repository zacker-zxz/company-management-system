const { getDB } = require('../config/database');

class Task {
  constructor(data) {
    this.title = data.title;
    this.description = data.description;
    this.assignedTo = data.assignedTo; // User ID
    this.assignedBy = data.assignedBy; // Admin ID
    this.priority = data.priority || 'Medium';
    this.status = data.status || 'Pending';
    this.deadline = data.deadline ? new Date(data.deadline) : null;
    this.progress = data.progress || 0;
    this.isActive = data.isActive !== undefined ? data.isActive : true;
  }

  // Save task to database
  async save() {
    const db = getDB();
    const result = await db.collection('tasks').insertOne({
      ...this,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return result;
  }

  // Find task by ID
  static async findById(id) {
    const db = getDB();
    const { ObjectId } = require('mongodb');
    return await db.collection('tasks').findOne({ _id: new ObjectId(id) });
  }

  // Get all tasks
  static async findAll() {
    const db = getDB();
    return await db.collection('tasks').find({}).toArray();
  }

  // Get tasks by user ID
  static async findByUserId(userId) {
    const db = getDB();
    return await db.collection('tasks').find({ assignedTo: userId }).toArray();
  }

  // Update task
  static async updateById(id, updateData) {
    const db = getDB();
    const { ObjectId } = require('mongodb');

    return await db.collection('tasks').updateOne(
      { _id: new ObjectId(id) },
      {
        $set: { ...updateData, updatedAt: new Date() }
      }
    );
  }

  // Delete task
  static async deleteById(id) {
    const db = getDB();
    const { ObjectId } = require('mongodb');
    return await db.collection('tasks').deleteOne({ _id: new ObjectId(id) });
  }
}

module.exports = Task;