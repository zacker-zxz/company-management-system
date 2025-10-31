const { getDB } = require('../config/database');
const { logger } = require('../utils/logger');

class DatabaseIndexService {
  constructor() {
    this.db = null;
  }

  async initialize() {
    this.db = getDB();
    await this.createIndexes();
  }

  async createIndexes() {
    try {
      // User collection indexes
      await this.createUserIndexes();
      
      // Task collection indexes
      await this.createTaskIndexes();
      
      // Payroll collection indexes (if exists)
      await this.createPayrollIndexes();
      
      logger.info('Database indexes created successfully');
    } catch (error) {
      logger.error('Failed to create database indexes:', error);
      // Don't throw - let the server start anyway
      console.log('Note: Some indexes could not be created. This may be due to existing duplicates.');
    }
  }

  async createUserIndexes() {
    const usersCollection = this.db.collection('users');
    
    // Check if indexes already exist before creating
    try {
      const existingIndexes = await usersCollection.indexes();
      const indexNames = existingIndexes.map(idx => idx.name);
      
      // Create unique indexes only if they don't exist
      if (!indexNames.includes('username_1')) {
        try {
          await usersCollection.createIndex({ username: 1 }, { unique: true, background: true });
        } catch (err) {
          console.log('Username index already exists or has duplicates');
        }
      }
      
      if (!indexNames.includes('email_1')) {
        try {
          await usersCollection.createIndex({ email: 1 }, { unique: true, background: true });
        } catch (err) {
          console.log('Email index already exists or has duplicates');
        }
      }
    } catch (err) {
      console.log('Error checking existing indexes:', err.message);
    }
    
    // Performance indexes (create if not exists)
    try {
      await usersCollection.createIndex({ role: 1 }, { background: true });
      await usersCollection.createIndex({ department: 1 }, { background: true });
      await usersCollection.createIndex({ isActive: 1 }, { background: true });
      await usersCollection.createIndex({ createdAt: -1 }, { background: true });
      await usersCollection.createIndex({ updatedAt: -1 }, { background: true });
      
      // Compound indexes for common queries
      await usersCollection.createIndex({ role: 1, isActive: 1 }, { background: true });
      await usersCollection.createIndex({ department: 1, isActive: 1 }, { background: true });
      await usersCollection.createIndex({ role: 1, department: 1 }, { background: true });
    } catch (err) {
      console.log('Some indexes may already exist:', err.message);
    }
    
    // Text search index
    try {
      await usersCollection.createIndex({
        name: 'text',
        email: 'text',
        department: 'text',
        position: 'text'
      }, { name: 'text_index', background: true });
    } catch (err) {
      console.log('Text index may already exist');
    }
    
    logger.info('User collection indexes created');
  }

  async createTaskIndexes() {
    const tasksCollection = this.db.collection('tasks');
    
    // Performance indexes
    await tasksCollection.createIndex({ assignee: 1 });
    await tasksCollection.createIndex({ assignedBy: 1 });
    await tasksCollection.createIndex({ priority: 1 });
    await tasksCollection.createIndex({ status: 1 });
    await tasksCollection.createIndex({ createdAt: -1 });
    await tasksCollection.createIndex({ updatedAt: -1 });
    await tasksCollection.createIndex({ deadline: 1 });
    
    // Compound indexes for common queries
    await tasksCollection.createIndex({ assignee: 1, status: 1 });
    await tasksCollection.createIndex({ priority: 1, status: 1 });
    await tasksCollection.createIndex({ assignee: 1, priority: 1 });
    await tasksCollection.createIndex({ status: 1, deadline: 1 });
    
    // Text search index
    await tasksCollection.createIndex({
      title: 'text',
      description: 'text'
    });
    
    logger.info('Task collection indexes created');
  }

  async createPayrollIndexes() {
    try {
      const payrollCollection = this.db.collection('payroll');
      
      // Performance indexes
      await payrollCollection.createIndex({ employeeId: 1 });
      await payrollCollection.createIndex({ period: 1 });
      await payrollCollection.createIndex({ createdAt: -1 });
      await payrollCollection.createIndex({ status: 1 });
      
      // Compound indexes
      await payrollCollection.createIndex({ employeeId: 1, period: 1 });
      await payrollCollection.createIndex({ period: 1, status: 1 });
      
      logger.info('Payroll collection indexes created');
    } catch (error) {
      // Payroll collection might not exist yet
      logger.info('Payroll collection not found, skipping indexes');
    }
  }

  async getIndexStats() {
    try {
      const usersStats = await this.db.collection('users').indexes();
      const tasksStats = await this.db.collection('tasks').indexes();
      
      return {
        users: usersStats.length,
        tasks: tasksStats.length,
        total: usersStats.length + tasksStats.length
      };
    } catch (error) {
      logger.error('Failed to get index stats:', error);
      return null;
    }
  }

  async analyzeQueryPerformance(collection, query, options = {}) {
    try {
      const collectionObj = this.db.collection(collection);
      const explainResult = await collectionObj.find(query, options).explain('executionStats');
      
      return {
        executionTime: explainResult.executionStats.executionTimeMillis,
        totalDocsExamined: explainResult.executionStats.totalDocsExamined,
        totalDocsReturned: explainResult.executionStats.totalDocsReturned,
        indexUsed: explainResult.executionStats.executionStages?.indexName || 'COLLSCAN',
        stage: explainResult.executionStats.executionStages?.stage
      };
    } catch (error) {
      logger.error('Query analysis failed:', error);
      return null;
    }
  }

  async optimizeSlowQueries() {
    try {
      // Analyze common queries and suggest optimizations
      const commonQueries = [
        { collection: 'users', query: { role: 'employee', isActive: true } },
        { collection: 'tasks', query: { assignee: 'someUserId', status: 'Pending' } },
        { collection: 'users', query: { department: 'Engineering' } }
      ];

      const optimizations = [];
      
      for (const queryInfo of commonQueries) {
        const analysis = await this.analyzeQueryPerformance(
          queryInfo.collection, 
          queryInfo.query
        );
        
        if (analysis && analysis.executionTime > 100) { // Slow query threshold
          optimizations.push({
            collection: queryInfo.collection,
            query: queryInfo.query,
            executionTime: analysis.executionTime,
            suggestion: analysis.indexUsed === 'COLLSCAN' ? 'Consider adding compound index' : 'Query is optimized'
          });
        }
      }
      
      return optimizations;
    } catch (error) {
      logger.error('Query optimization analysis failed:', error);
      return [];
    }
  }
}

// Create singleton instance
const databaseIndexService = new DatabaseIndexService();

module.exports = databaseIndexService;
