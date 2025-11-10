// Test setup file
const { MongoMemoryServer } = require('mongodb-memory-server');

// Increase timeout for database operations
jest.setTimeout(30000);

// Global test setup
beforeAll(async () => {
  // Set test environment variables
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test-secret-key-for-jwt';
  process.env.JWT_EXPIRES_IN = '15m';
  process.env.REFRESH_TOKEN_EXPIRES_IN = '7d';
});

// Global test cleanup
afterAll(async () => {
  // Cleanup any global resources
});

// Suppress console.log in tests unless explicitly needed
const originalConsoleLog = console.log;
beforeEach(() => {
  console.log = jest.fn();
});

afterEach(() => {
  console.log = originalConsoleLog;
});

