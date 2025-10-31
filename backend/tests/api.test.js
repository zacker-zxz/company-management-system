const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { MongoClient } = require('mongodb');
const app = require('../server');

describe('Zacker Management System API', () => {
  let mongoServer;
  let mongoClient;
  let db;

  beforeAll(async () => {
    // Start in-memory MongoDB
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    
    // Set environment variables
    process.env.MONGODB_URI = mongoUri;
    process.env.JWT_SECRET = 'test-secret-key';
    process.env.NODE_ENV = 'test';
    
    // Connect to test database
    mongoClient = new MongoClient(mongoUri);
    await mongoClient.connect();
    db = mongoClient.db('zacker_management_test');
  });

  afterAll(async () => {
    await mongoClient.close();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    // Clear database before each test
    await db.collection('users').deleteMany({});
    await db.collection('tasks').deleteMany({});
  });

  describe('Authentication', () => {
    let adminToken;
    let employeeToken;

    beforeEach(async () => {
      // Create test admin user
      const adminUser = {
        username: 'admin',
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
        role: 'admin',
        name: 'Admin User',
        email: 'admin@test.com',
        department: 'Management',
        position: 'CEO',
        salary: 100000,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await db.collection('users').insertOne(adminUser);

      // Create test employee user
      const employeeUser = {
        username: 'employee',
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
        role: 'employee',
        name: 'Employee User',
        email: 'employee@test.com',
        department: 'Engineering',
        position: 'Developer',
        salary: 50000,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await db.collection('users').insertOne(employeeUser);
    });

    describe('POST /api/auth/login', () => {
      it('should login admin user successfully', async () => {
        const response = await request(app)
          .post('/api/auth/login')
          .send({
            username: 'admin',
            password: 'password'
          });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.user.role).toBe('admin');
        expect(response.body.data.accessToken).toBeDefined();
        expect(response.body.data.refreshToken).toBeDefined();

        adminToken = response.body.data.accessToken;
      });

      it('should login employee user successfully', async () => {
        const response = await request(app)
          .post('/api/auth/login')
          .send({
            username: 'employee',
            password: 'password'
          });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.user.role).toBe('employee');
        expect(response.body.data.accessToken).toBeDefined();

        employeeToken = response.body.data.accessToken;
      });

      it('should reject invalid credentials', async () => {
        const response = await request(app)
          .post('/api/auth/login')
          .send({
            username: 'admin',
            password: 'wrongpassword'
          });

        expect(response.status).toBe(401);
        expect(response.body.error).toBe('Invalid credentials');
      });

      it('should reject non-existent user', async () => {
        const response = await request(app)
          .post('/api/auth/login')
          .send({
            username: 'nonexistent',
            password: 'password'
          });

        expect(response.status).toBe(401);
        expect(response.body.error).toBe('Invalid credentials');
      });

      it('should validate input data', async () => {
        const response = await request(app)
          .post('/api/auth/login')
          .send({
            username: '', // Empty username
            password: 'password'
          });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Validation Error');
      });
    });

    describe('GET /api/auth/verify', () => {
      it('should verify valid token', async () => {
        const response = await request(app)
          .get('/api/auth/verify')
          .set('Authorization', `Bearer ${adminToken}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.valid).toBe(true);
        expect(response.body.data.user.role).toBe('admin');
      });

      it('should reject invalid token', async () => {
        const response = await request(app)
          .get('/api/auth/verify')
          .set('Authorization', 'Bearer invalid-token');

        expect(response.status).toBe(401);
        expect(response.body.error).toBe('Invalid token');
      });

      it('should reject missing token', async () => {
        const response = await request(app)
          .get('/api/auth/verify');

        expect(response.status).toBe(401);
        expect(response.body.error).toBe('No token provided');
      });
    });
  });

  describe('Employee Management', () => {
    let adminToken;

    beforeEach(async () => {
      // Create admin user and get token
      const adminUser = {
        username: 'admin',
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        role: 'admin',
        name: 'Admin User',
        email: 'admin@test.com',
        department: 'Management',
        position: 'CEO',
        salary: 100000,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await db.collection('users').insertOne(adminUser);

      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'admin',
          password: 'password'
        });

      adminToken = loginResponse.body.data.accessToken;
    });

    describe('GET /api/employees', () => {
      beforeEach(async () => {
        // Create test employees
        const employees = [
          {
            username: 'emp1',
            password: 'hashed',
            role: 'employee',
            name: 'Employee One',
            email: 'emp1@test.com',
            department: 'Engineering',
            position: 'Developer',
            salary: 50000,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            username: 'emp2',
            password: 'hashed',
            role: 'employee',
            name: 'Employee Two',
            email: 'emp2@test.com',
            department: 'Sales',
            position: 'Sales Rep',
            salary: 45000,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ];

        await db.collection('users').insertMany(employees);
      });

      it('should get all employees', async () => {
        const response = await request(app)
          .get('/api/employees')
          .set('Authorization', `Bearer ${adminToken}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveLength(2);
        expect(response.body.pagination).toBeDefined();
      });

      it('should support pagination', async () => {
        const response = await request(app)
          .get('/api/employees?page=1&limit=1')
          .set('Authorization', `Bearer ${adminToken}`);

        expect(response.status).toBe(200);
        expect(response.body.data).toHaveLength(1);
        expect(response.body.pagination.page).toBe(1);
        expect(response.body.pagination.limit).toBe(1);
      });

      it('should reject unauthorized access', async () => {
        const response = await request(app)
          .get('/api/employees');

        expect(response.status).toBe(401);
      });
    });

    describe('POST /api/employees', () => {
      it('should create new employee', async () => {
        const employeeData = {
          name: 'New Employee',
          email: 'new@test.com',
          department: 'Engineering',
          position: 'Developer',
          salary: 55000
        };

        const response = await request(app)
          .post('/api/employees')
          .set('Authorization', `Bearer ${adminToken}`)
          .send(employeeData);

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.data.name).toBe(employeeData.name);
        expect(response.body.data.email).toBe(employeeData.email);
      });

      it('should validate employee data', async () => {
        const invalidData = {
          name: '', // Empty name
          email: 'invalid-email',
          department: 'InvalidDept',
          position: 'Developer',
          salary: -1000
        };

        const response = await request(app)
          .post('/api/employees')
          .set('Authorization', `Bearer ${adminToken}`)
          .send(invalidData);

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Validation Error');
      });

      it('should reject duplicate email', async () => {
        // Create first employee
        const employeeData = {
          name: 'First Employee',
          email: 'duplicate@test.com',
          department: 'Engineering',
          position: 'Developer',
          salary: 50000
        };

        await request(app)
          .post('/api/employees')
          .set('Authorization', `Bearer ${adminToken}`)
          .send(employeeData);

        // Try to create second employee with same email
        const duplicateData = {
          name: 'Second Employee',
          email: 'duplicate@test.com',
          department: 'Sales',
          position: 'Sales Rep',
          salary: 45000
        };

        const response = await request(app)
          .post('/api/employees')
          .set('Authorization', `Bearer ${adminToken}`)
          .send(duplicateData);

        expect(response.status).toBe(409);
        expect(response.body.error).toBe('Employee with this email already exists');
      });
    });

    describe('PUT /api/employees/:id', () => {
      let employeeId;

      beforeEach(async () => {
        const employeeData = {
          username: 'emp1',
          password: 'hashed',
          role: 'employee',
          name: 'Test Employee',
          email: 'test@test.com',
          department: 'Engineering',
          position: 'Developer',
          salary: 50000,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        const result = await db.collection('users').insertOne(employeeData);
        employeeId = result.insertedId.toString();
      });

      it('should update employee', async () => {
        const updateData = {
          name: 'Updated Employee',
          salary: 60000
        };

        const response = await request(app)
          .put(`/api/employees/${employeeId}`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send(updateData);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
      });

      it('should validate update data', async () => {
        const invalidData = {
          salary: -1000
        };

        const response = await request(app)
          .put(`/api/employees/${employeeId}`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send(invalidData);

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Validation Error');
      });

      it('should reject invalid employee ID', async () => {
        const response = await request(app)
          .put('/api/employees/invalid-id')
          .set('Authorization', `Bearer ${adminToken}`)
          .send({ name: 'Updated' });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Validation Error');
      });
    });

    describe('DELETE /api/employees/:id', () => {
      let employeeId;

      beforeEach(async () => {
        const employeeData = {
          username: 'emp1',
          password: 'hashed',
          role: 'employee',
          name: 'Test Employee',
          email: 'test@test.com',
          department: 'Engineering',
          position: 'Developer',
          salary: 50000,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        const result = await db.collection('users').insertOne(employeeData);
        employeeId = result.insertedId.toString();
      });

      it('should delete employee', async () => {
        const response = await request(app)
          .delete(`/api/employees/${employeeId}`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
      });

      it('should reject invalid employee ID', async () => {
        const response = await request(app)
          .delete('/api/employees/invalid-id')
          .set('Authorization', `Bearer ${adminToken}`);

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Validation Error');
      });
    });
  });

  describe('Health Check', () => {
    it('should return server status', async () => {
      const response = await request(app)
        .get('/api/health');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('OK');
      expect(response.body.timestamp).toBeDefined();
      expect(response.body.environment).toBe('test');
    });
  });

  describe('Error Handling', () => {
    it('should handle 404 errors', async () => {
      const response = await request(app)
        .get('/api/nonexistent');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Not Found');
    });

    it('should handle rate limiting', async () => {
      // Make multiple requests to trigger rate limiting
      const promises = Array(10).fill().map(() => 
        request(app).get('/api/health')
      );

      const responses = await Promise.all(promises);
      
      // All requests should succeed in test environment
      responses.forEach(response => {
        expect(response.status).toBe(200);
      });
    });
  });
});
