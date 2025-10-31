const NodeCache = require('node-cache');

class CacheService {
  constructor() {
    // Create cache instances for different data types
    this.userCache = new NodeCache({ 
      stdTTL: 300, // 5 minutes
      checkperiod: 60, // Check for expired keys every minute
      useClones: false
    });
    
    this.taskCache = new NodeCache({ 
      stdTTL: 180, // 3 minutes
      checkperiod: 60,
      useClones: false
    });
    
    this.payrollCache = new NodeCache({ 
      stdTTL: 600, // 10 minutes
      checkperiod: 120,
      useClones: false
    });
    
    this.statsCache = new NodeCache({ 
      stdTTL: 120, // 2 minutes
      checkperiod: 30,
      useClones: false
    });

    // Cache statistics
    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0,
      deletes: 0
    };
  }

  // Generic cache operations
  get(cacheType, key) {
    const cache = this.getCacheInstance(cacheType);
    const value = cache.get(key);
    
    if (value !== undefined) {
      this.stats.hits++;
      return value;
    }
    
    this.stats.misses++;
    return null;
  }

  set(cacheType, key, value, ttl = null) {
    const cache = this.getCacheInstance(cacheType);
    const success = cache.set(key, value, ttl);
    
    if (success) {
      this.stats.sets++;
    }
    
    return success;
  }

  delete(cacheType, key) {
    const cache = this.getCacheInstance(cacheType);
    const success = cache.del(key);
    
    if (success) {
      this.stats.deletes++;
    }
    
    return success;
  }

  clear(cacheType) {
    const cache = this.getCacheInstance(cacheType);
    cache.flushAll();
  }

  clearAll() {
    this.userCache.flushAll();
    this.taskCache.flushAll();
    this.payrollCache.flushAll();
    this.statsCache.flushAll();
  }

  // Get cache instance by type
  getCacheInstance(cacheType) {
    switch (cacheType) {
      case 'user':
        return this.userCache;
      case 'task':
        return this.taskCache;
      case 'payroll':
        return this.payrollCache;
      case 'stats':
        return this.statsCache;
      default:
        throw new Error(`Unknown cache type: ${cacheType}`);
    }
  }

  // User-specific cache operations
  getUser(userId) {
    return this.get('user', `user:${userId}`);
  }

  setUser(userId, userData, ttl = null) {
    return this.set('user', `user:${userId}`, userData, ttl);
  }

  deleteUser(userId) {
    return this.delete('user', `user:${userId}`);
  }

  getUsersList(filters = '') {
    return this.get('user', `users:list:${filters}`);
  }

  setUsersList(filters, usersData, ttl = null) {
    return this.set('user', `users:list:${filters}`, usersData, ttl);
  }

  // Task-specific cache operations
  getTask(taskId) {
    return this.get('task', `task:${taskId}`);
  }

  setTask(taskId, taskData, ttl = null) {
    return this.set('task', `task:${taskId}`, taskData, ttl);
  }

  deleteTask(taskId) {
    return this.delete('task', `task:${taskId}`);
  }

  getTasksList(filters = '') {
    return this.get('task', `tasks:list:${filters}`);
  }

  setTasksList(filters, tasksData, ttl = null) {
    return this.set('task', `tasks:list:${filters}`, tasksData, ttl);
  }

  getUserTasks(userId) {
    return this.get('task', `tasks:user:${userId}`);
  }

  setUserTasks(userId, tasksData, ttl = null) {
    return this.set('task', `tasks:user:${userId}`, tasksData, ttl);
  }

  // Payroll-specific cache operations
  getPayrollSummary() {
    return this.get('payroll', 'payroll:summary');
  }

  setPayrollSummary(summaryData, ttl = null) {
    return this.set('payroll', 'payroll:summary', summaryData, ttl);
  }

  getEmployeePayroll(employeeId) {
    return this.get('payroll', `payroll:employee:${employeeId}`);
  }

  setEmployeePayroll(employeeId, payrollData, ttl = null) {
    return this.set('payroll', `payroll:employee:${employeeId}`, payrollData, ttl);
  }

  // Statistics cache operations
  getDashboardStats() {
    return this.get('stats', 'dashboard:stats');
  }

  setDashboardStats(statsData, ttl = null) {
    return this.set('stats', 'dashboard:stats', statsData, ttl);
  }

  getDepartmentStats() {
    return this.get('stats', 'department:stats');
  }

  setDepartmentStats(statsData, ttl = null) {
    return this.set('stats', 'department:stats', statsData, ttl);
  }

  // Cache invalidation patterns
  invalidateUserRelated(userId) {
    // Clear user-specific caches
    this.deleteUser(userId);
    this.delete('user', `tasks:user:${userId}`);
    this.delete('payroll', `payroll:employee:${userId}`);
    
    // Clear list caches that might include this user
    this.clear('user');
    this.clear('stats');
  }

  invalidateTaskRelated(taskId) {
    // Clear task-specific caches
    this.deleteTask(taskId);
    
    // Clear list caches that might include this task
    this.clear('task');
    this.clear('stats');
  }

  invalidatePayrollRelated() {
    // Clear all payroll-related caches
    this.clear('payroll');
    this.clear('stats');
  }

  // Cache statistics
  getStats() {
    const userStats = this.userCache.getStats();
    const taskStats = this.taskCache.getStats();
    const payrollStats = this.payrollCache.getStats();
    const statsStats = this.statsCache.getStats();

    return {
      overall: {
        hits: this.stats.hits,
        misses: this.stats.misses,
        sets: this.stats.sets,
        deletes: this.stats.deletes,
        hitRate: this.stats.hits / (this.stats.hits + this.stats.misses) || 0
      },
      byType: {
        user: userStats,
        task: taskStats,
        payroll: payrollStats,
        stats: statsStats
      }
    };
  }

  // Cache warming (preload frequently accessed data)
  async warmCache() {
    try {
      const User = require('../models/User');
      const Task = require('../models/Task');
      
      // Warm user cache with active users
      const activeUsers = await User.findAll();
      activeUsers.forEach(user => {
        this.setUser(user._id.toString(), user);
      });
      
      // Warm task cache with recent tasks
      const recentTasks = await Task.findAll();
      recentTasks.forEach(task => {
        this.setTask(task._id.toString(), task);
      });
      
      console.log('Cache warmed successfully');
    } catch (error) {
      console.error('Cache warming failed:', error);
    }
  }

  // Cache cleanup
  cleanup() {
    this.userCache.close();
    this.taskCache.close();
    this.payrollCache.close();
    this.statsCache.close();
  }
}

// Create singleton instance
const cacheService = new CacheService();

// Warm cache on startup
setTimeout(() => {
  cacheService.warmCache();
}, 5000);

// Periodic cache warming
setInterval(() => {
  cacheService.warmCache();
}, 30 * 60 * 1000); // Every 30 minutes

module.exports = cacheService;
