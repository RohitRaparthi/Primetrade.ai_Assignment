const { Task, User } = require('../models');


const createTask = async (req, res) => {
try {
const { title, description } = req.body;
const task = await Task.create({ title, description, userId: req.user.id });
return res.status(201).json(task);
} catch (err) {
console.error(err);
return res.status(500).json({ message: 'Server error' });
}
};


const getTasks = async (req, res) => {
try {
const { q, status } = req.query;
const where = {};
if (req.user.role !== 'admin') where.userId = req.user.id;
if (status) where.status = status;
if (q) where.title = { [require('sequelize').Op.like]: `%${q}%` };


const tasks = await Task.findAll({ where });
return res.json(tasks);
} catch (err) {
console.error(err);
return res.status(500).json({ message: 'Server error' });
}
};


const updateTask = async (req, res) => {
try {
const { id } = req.params;
const task = await Task.findByPk(id);
if (!task) return res.status(404).json({ message: 'Not found' });
if (req.user.role !== 'admin' && task.userId !== req.user.id) return res.status(403).json({ message: 'Forbidden' });


await task.update(req.body);
return res.json(task);
} catch (err) {
console.error(err);
return res.status(500).json({ message: 'Server error' });
}
};


const deleteTask = async (req, res) => {
try {
const { id } = req.params;
const task = await Task.findByPk(id);
if (!task) return res.status(404).json({ message: 'Not found' });
// Only admin can delete
if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });


await task.destroy();
return res.json({ message: 'Deleted' });
} catch (err) {
console.error(err);
return res.status(500).json({ message: 'Server error' });
}
};


module.exports = { createTask, getTasks, updateTask, deleteTask };