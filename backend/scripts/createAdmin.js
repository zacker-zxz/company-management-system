const { connectDB, closeDB } = require('../config/database');
const User = require('../models/User');

async function createAdminUser() {
  try {
    // Connect to database
    await connectDB();

    // Check if admin already exists
    const existingAdmin = await User.findByUsername('zacker');
    if (existingAdmin) {
      console.log('❌ Admin user already exists');
      return;
    }

    // Create admin user
    const adminData = {
      username: 'zacker',
      password: 'Zacker@@@',
      role: 'admin',
      name: 'System Administrator',
      email: 'admin@zacker.com',
      department: 'Management',
      position: 'CEO',
      salary: 0,
      isActive: true
    };

    const admin = new User(adminData);

    // Hash password
    await admin.hashPassword();

    // Save to database
    await admin.save();

    console.log('✅ Admin user created successfully!');
    console.log('Username: zacker');
    console.log('Password: Zacker@@@');

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    await closeDB();
  }
}

// Run the script
createAdminUser();