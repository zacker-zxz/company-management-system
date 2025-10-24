const { connectDB } = require('../config/database');
const User = require('../models/User');
const Task = require('../models/Task');

async function createSampleData() {
  try {
    // Connect to database
    await connectDB();

    // Sample Indian employees
    const employees = [
      {
        username: 'rahul.sharma',
        password: 'TempPass123!',
        role: 'employee',
        name: 'Rahul Sharma',
        email: 'rahul.sharma@zacker.io',
        department: 'Engineering',
        position: 'Senior Software Engineer',
        salary: 8500,
        isActive: true
      },
      {
        username: 'priya.patel',
        password: 'TempPass123!',
        role: 'employee',
        name: 'Priya Patel',
        email: 'priya.patel@zacker.io',
        department: 'Sales',
        position: 'Sales Manager',
        salary: 7500,
        isActive: true
      },
      {
        username: 'arjun.verma',
        password: 'TempPass123!',
        role: 'employee',
        name: 'Arjun Verma',
        email: 'arjun.verma@zacker.io',
        department: 'Engineering',
        position: 'Backend Developer',
        salary: 7000,
        isActive: true
      },
      {
        username: 'kavita.singh',
        password: 'TempPass123!',
        role: 'employee',
        name: 'Kavita Singh',
        email: 'kavita.singh@zacker.io',
        department: 'Marketing',
        position: 'Marketing Lead',
        salary: 6500,
        isActive: true
      },
      {
        username: 'vikas.kumar',
        password: 'TempPass123!',
        role: 'employee',
        name: 'Vikas Kumar',
        email: 'vikas.kumar@zacker.io',
        department: 'HR',
        position: 'HR Manager',
        salary: 6800,
        isActive: true
      }
    ];

    // Create employees
    console.log('Creating sample employees...');
    for (const empData of employees) {
      const employee = new User(empData);
      await employee.hashPassword();
      await employee.save();
      console.log(`✅ Created employee: ${empData.name}`);
    }

    // Get employee IDs for task assignment
    const savedEmployees = await User.findAll();
    const employeeMap = {};
    savedEmployees.forEach(emp => {
      if (emp.role === 'employee') {
        employeeMap[emp.name] = emp._id.toString();
      }
    });

    // Get admin user ID for assignedBy
    const adminUser = await User.findByUsername('zacker');
    const adminId = adminUser ? adminUser._id.toString() : 'admin';

    // Sample tasks
    const tasks = [
      {
        title: 'Complete Q4 Blockchain Integration',
        description: 'Implement advanced blockchain integration for enterprise clients with enhanced security protocols and smart contract deployment.',
        assignedTo: employeeMap['Rahul Sharma'],
        assignedBy: adminId,
        priority: 'High',
        status: 'In Progress',
        deadline: new Date('2024-12-15'),
        progress: 75,
        isActive: true
      },
      {
        title: 'Client Presentation Preparation',
        description: 'Prepare comprehensive presentation for upcoming client meeting showcasing our blockchain solutions and ROI metrics.',
        assignedTo: employeeMap['Priya Patel'],
        assignedBy: adminId,
        priority: 'Medium',
        status: 'Pending',
        deadline: new Date('2024-11-20'),
        progress: 0,
        isActive: true
      },
      {
        title: 'API Security Audit',
        description: 'Conduct thorough security audit of all API endpoints and implement additional security measures for data protection.',
        assignedTo: employeeMap['Arjun Verma'],
        assignedBy: adminId,
        priority: 'High',
        status: 'In Progress',
        deadline: new Date('2024-11-25'),
        progress: 45,
        isActive: true
      },
      {
        title: 'Marketing Campaign Launch',
        description: 'Launch new marketing campaign highlighting our blockchain management platform features and client success stories.',
        assignedTo: employeeMap['Kavita Singh'],
        assignedBy: adminId,
        priority: 'Medium',
        status: 'Completed',
        deadline: new Date('2024-11-10'),
        progress: 100,
        isActive: true
      },
      {
        title: 'Team Performance Review',
        description: 'Conduct quarterly performance reviews for all team members and prepare improvement plans for Q1 2025.',
        assignedTo: employeeMap['Vikas Kumar'],
        assignedBy: adminId,
        priority: 'Low',
        status: 'Pending',
        deadline: new Date('2024-12-01'),
        progress: 0,
        isActive: true
      },
      {
        title: 'Database Optimization',
        description: 'Optimize database queries and implement caching mechanisms for better performance and reduced latency.',
        assignedTo: employeeMap['Rahul Sharma'],
        assignedBy: adminId,
        priority: 'High',
        status: 'In Progress',
        deadline: new Date('2024-11-30'),
        progress: 60,
        isActive: true
      },
      {
        title: 'Security Documentation Update',
        description: 'Update all security documentation and create new guidelines for blockchain implementation and compliance.',
        assignedTo: employeeMap['Arjun Verma'],
        assignedBy: adminId,
        priority: 'Critical',
        status: 'Pending',
        deadline: new Date('2024-12-05'),
        progress: 20,
        isActive: true
      },
      {
        title: 'Client Onboarding Process',
        description: 'Streamline the client onboarding process for new blockchain enterprise clients with automated workflows.',
        assignedTo: employeeMap['Priya Patel'],
        assignedBy: adminId,
        priority: 'Medium',
        status: 'In Progress',
        deadline: new Date('2024-11-28'),
        progress: 30,
        isActive: true
      },
      {
        title: 'Mobile App Development',
        description: 'Develop mobile application for blockchain transaction monitoring and management on-the-go.',
        assignedTo: employeeMap['Rahul Sharma'],
        assignedBy: adminId,
        priority: 'High',
        status: 'Pending',
        deadline: new Date('2024-12-20'),
        progress: 10,
        isActive: true
      },
      {
        title: 'Compliance Training Program',
        description: 'Create and implement compliance training program for all employees regarding blockchain regulations.',
        assignedTo: employeeMap['Vikas Kumar'],
        assignedBy: adminId,
        priority: 'Medium',
        status: 'Pending',
        deadline: new Date('2024-12-10'),
        progress: 0,
        isActive: true
      }
    ];

    // Create tasks
    console.log('Creating sample tasks...');
    for (const taskData of tasks) {
      const task = new Task(taskData);
      await task.save();
      console.log(`✅ Created task: ${taskData.title}`);
    }

    console.log('\n🎉 Sample data created successfully!');
    console.log('\n📊 Sample Employees:');
    employees.forEach(emp => {
      console.log(`   - ${emp.name} (${emp.position}) - ${emp.department}`);
    });

    console.log('\n📋 Sample Tasks:');
    tasks.forEach(task => {
      const assigneeName = employees.find(e => employeeMap[e.name] === task.assignedTo)?.name;
      console.log(`   - ${task.title} (${task.priority}) - Assigned to: ${assigneeName}`);
    });

    console.log('\n🔐 Login Credentials:');
    console.log('   Admin: zacker / Zacker@@@');
    console.log('   Employees: Use their email username with password: TempPass123!');

    process.exit(0);

  } catch (error) {
    console.error('Error creating sample data:', error);
    process.exit(1);
  }
}

createSampleData();