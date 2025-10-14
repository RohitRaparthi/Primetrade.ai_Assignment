const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const { createTask, getTasks, updateTask, deleteTask } = require('../controllers/taskController');


router.use(auth);
router.get('/', getTasks);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', role('admin'), deleteTask);


module.exports = router;