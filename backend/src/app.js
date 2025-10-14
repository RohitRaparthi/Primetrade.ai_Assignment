const express = require('express');
const cors = require('cors');
require('dotenv').config();
const sequelize = require('./config/database'); // your Sequelize instance

const app = express();
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/v1/auth', require('./routes/auth.routes'));
app.use('/api/v1/tasks', require('./routes/task.routes'));

// Sync DB and start server
const PORT = process.env.PORT || 5000;

sequelize.sync({ alter: true })  // ensures DB tables exist
  .then(() => {
    console.log('✅ Database connected & synced');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('❌ Database connection error:', err);
  });
