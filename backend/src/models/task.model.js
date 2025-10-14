const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user.model');


const Task = sequelize.define('Task', {
id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
title: { type: DataTypes.STRING, allowNull: false },
description: { type: DataTypes.TEXT },
status: { type: DataTypes.STRING, defaultValue: 'pending' }
});


Task.belongsTo(User, { foreignKey: 'userId', as: 'owner' });
User.hasMany(Task, { foreignKey: 'userId', as: 'tasks' });


module.exports = Task;