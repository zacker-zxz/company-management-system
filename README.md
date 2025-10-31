# Zacker Management System

A comprehensive enterprise management platform built with Next.js, Express.js, and MongoDB. Features role-based authentication, employee management, task tracking, and payroll processing.

## 🚀 Features

### Core Functionality
- **Role-based Authentication** - Admin and Employee roles with JWT tokens
- **Employee Management** - CRUD operations with validation
- **Task Management** - Create, assign, and track tasks
- **Payroll Processing** - Automated payroll calculations
- **Dashboard Analytics** - Charts and performance metrics
- **Responsive Design** - Mobile-friendly interface

### Security Features
- **Rate Limiting** - API protection against abuse
- **Input Validation** - Comprehensive data validation
- **CORS Protection** - Configurable origin restrictions
- **Helmet Security** - Security headers
- **Password Hashing** - bcrypt with salt rounds
- **Token Refresh** - Automatic token renewal

### Development Features
- **TypeScript** - Full type safety
- **Error Boundaries** - Graceful error handling
- **Comprehensive Testing** - Unit and integration tests
- **Structured Logging** - Detailed operation logs
- **ESLint** - Code quality enforcement
- **Hot Reload** - Development efficiency

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Recharts** - Data visualization
- **Radix UI** - Component library

### Backend
- **Express.js** - Web framework
- **MongoDB** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Express Validator** - Input validation
- **Helmet** - Security middleware

### Development Tools
- **Jest** - Testing framework
- **Supertest** - API testing
- **ESLint** - Code linting
- **MongoDB Memory Server** - Test database

## 📋 Prerequisites

- Node.js 18.0.0 or higher
- MongoDB 6.0 or higher
- npm 8.0.0 or higher

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/zacker-management-system.git
cd zacker-management-system
```

### 2. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 3. Environment Setup

Create environment files:

```bash
# Backend environment
cp backend/env.example backend/.env

# Frontend environment
echo "NEXT_PUBLIC_API_URL=http://localhost:5000" > .env.local
```

Edit `backend/.env` with your configuration:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/zacker_management
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

### 4. Database Setup

Start MongoDB and run the setup scripts:

```bash
# Start MongoDB (if not running)
mongod

# Create admin user
cd backend
node scripts/createAdmin.js

# Create sample data
node scripts/createSampleData.js
cd ..
```

### 5. Start Development Servers

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
npm run dev
```

### 6. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/health

## 🔐 Default Credentials

### Admin Account
- **Username**: `zacker`
- **Password**: `Zacker@@@`

### Sample Employee Accounts
- **Username**: `rahul.sharma` / **Password**: `TempPass123!`
- **Username**: `priya.patel` / **Password**: `TempPass123!`
- **Username**: `arjun.verma` / **Password**: `TempPass123!`

## 📁 Project Structure

```
zacker-management-system/
├── app/                      # Next.js app directory
│   ├── admin/               # Admin dashboard
│   ├── employee/            # Employee dashboard
│   ├── login/               # Authentication
│   └── globals.css          # Global styles
├── backend/                 # Express.js API
│   ├── config/             # Database configuration
│   ├── controllers/        # Business logic
│   ├── middleware/         # Custom middleware
│   ├── models/             # Data models
│   ├── routes/             # API routes
│   ├── services/            # Business services
│   ├── tests/              # Test files
│   └── utils/              # Utility functions
├── components/             # Reusable components
├── contexts/               # React contexts
├── services/               # Frontend services
├── types/                  # TypeScript definitions
└── public/                 # Static assets
```

## 🧪 Testing

### Run Tests

```bash
# Backend tests
cd backend
npm test

# Run tests with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

### Test Coverage

The test suite includes:
- **Authentication** - Login, token refresh, logout
- **Employee Management** - CRUD operations
- **Task Management** - Task operations
- **API Validation** - Input validation
- **Error Handling** - Error scenarios

## 🔧 Development

### Code Quality

```bash
# Lint code
cd backend
npm run lint

# Fix linting issues
npm run lint:fix
```

### Database Operations

```bash
# Connect to MongoDB
mongosh mongodb://localhost:27017/zacker_management

# View collections
show collections

# View users
db.users.find().pretty()

# View tasks
db.tasks.find().pretty()
```

## 🚀 Production Deployment

### Environment Variables

Set these environment variables in production:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://your-production-mongodb-url
JWT_SECRET=your-production-secret-key
ALLOWED_ORIGINS=https://your-production-domain.com
```

### Security Checklist

- [ ] Change default JWT secret
- [ ] Use HTTPS in production
- [ ] Configure proper CORS origins
- [ ] Set up rate limiting
- [ ] Enable security headers
- [ ] Use environment variables
- [ ] Set up monitoring
- [ ] Configure logging

### Docker Deployment

```dockerfile
# Dockerfile example
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY backend/package*.json ./backend/

# Install dependencies
RUN npm ci --only=production
RUN cd backend && npm ci --only=production

# Copy source code
COPY . .

# Build application
RUN npm run build

# Expose port
EXPOSE 3000 5000

# Start application
CMD ["npm", "start"]
```

## 📊 API Documentation

### Authentication Endpoints

```http
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
GET  /api/auth/verify
```

### Employee Endpoints

```http
GET    /api/employees
POST   /api/employees
GET    /api/employees/:id
PUT    /api/employees/:id
DELETE /api/employees/:id
```

### Task Endpoints

```http
GET    /api/tasks
POST   /api/tasks
GET    /api/tasks/:id
PUT    /api/tasks/:id
DELETE /api/tasks/:id
GET    /api/tasks/user
```

### Payroll Endpoints

```http
POST /api/payroll/process
GET  /api/payroll/summary
GET  /api/payroll/employee/:id
```

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   ```bash
   # Check if MongoDB is running
   mongosh --eval "db.runCommand('ping')"
   ```

2. **Port Already in Use**
   ```bash
   # Kill process on port 5000
   lsof -ti:5000 | xargs kill -9
   ```

3. **Token Expired Error**
   - Check JWT_SECRET is set
   - Verify token format
   - Check token expiry time

4. **CORS Error**
   - Verify ALLOWED_ORIGINS includes your frontend URL
   - Check if credentials are enabled

### Debug Mode

Enable debug logging:

```bash
DEBUG=zacker:* npm run dev
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

### Development Guidelines

- Follow TypeScript strict mode
- Write comprehensive tests
- Use meaningful commit messages
- Follow the existing code style
- Update documentation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- **Issues**: [GitHub Issues](https://github.com/your-username/zacker-management-system/issues)
- **Documentation**: [Wiki](https://github.com/your-username/zacker-management-system/wiki)
- **Email**: support@zacker.com

## 🎯 Roadmap

### Upcoming Features
- [ ] Email notifications
- [ ] File upload system
- [ ] Advanced reporting
- [ ] Mobile app
- [ ] Real-time updates
- [ ] Multi-language support
- [ ] Advanced analytics
- [ ] API versioning

### Performance Improvements
- [ ] Database indexing
- [ ] Caching layer
- [ ] CDN integration
- [ ] Image optimization
- [ ] Code splitting
- [ ] Lazy loading

---

**Built with ❤️ by the Zacker Team**