// backend/src/seedAdmin.js
require('dotenv').config();
const bcrypt = require('bcrypt');
const { sequelize, User } = require('./models');

async function seedAdmin() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@primetrade.ai';
    const adminName = process.env.SEED_ADMIN_NAME || 'Admin';
    const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'Admin@123';

    const existing = await User.findOne({ where: { email: adminEmail } });
    if (existing) {
      console.log(`Admin already exists: ${adminEmail}`);
      process.exit(0);
    }

    const hashed = await bcrypt.hash(adminPassword, 10);
    const admin = await User.create({
      name: adminName,
      email: adminEmail,
      password: hashed,
      role: 'admin',
    });

    console.log('Admin user created:');
    console.log({ id: admin.id, email: admin.email, name: admin.name });
    console.log('Login with:', adminEmail, '/', adminPassword);
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed', err);
    process.exit(1);
  }
}

seedAdmin();
