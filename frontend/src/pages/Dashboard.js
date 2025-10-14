// frontend/src/pages/Dashboard.js
import React, { useEffect, useState } from 'react';
import { getTasks, createTask, updateTask, deleteTask } from '../services/tasks';
import { getProfile } from '../services/auth';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [profile, setProfile] = useState({});
  const [title, setTitle] = useState('');
  const [role, setRole] = useState('user');
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState('');


  const fetchTasks = async () => {
    const data = await getTasks();
    setTasks(data);
  };

  const fetchProfile = async () => {
    const data = await getProfile();
    setProfile(data);
    setRole(data.role);
  };

  useEffect(() => {
    fetchTasks();
    fetchProfile();
  }, []);

  const handleAdd = async () => {
    if (!title) return;
    await createTask({ title, description: '' });
    setTitle('');
    fetchTasks();
  };

  const handleDelete = async (id) => {
    await deleteTask(id);
    fetchTasks();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  const handleEdit = (task) => {
  setEditTaskId(task.id);
  setEditTitle(task.title);
  };

  const handleUpdate = async () => {
  if (!editTitle) return;
  await updateTask(editTaskId, { title: editTitle, description: '' });
  setEditTaskId(null);
  setEditTitle('');
  fetchTasks();
  };



  return (
        <div className="container py-4">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary rounded mb-4 shadow">
        <div className="container-fluid">
          <span className="navbar-brand fw-bold">🌐 Dashboard</span>
          <div className="d-flex align-items-center">
            <span className="text-white me-3">
              {profile.name} ({role === 'admin' ? (
                <span className="badge bg-danger">Admin</span>
              ) : (
                <span className="badge bg-secondary">User</span>
              )})
            </span>
            <button className="btn btn-light btn-sm" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </nav>

      {/* Add Task Card */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h5 className="card-title text-primary">Add New Task</h5>
          <div className="d-flex">
            <input
              type="text"
              className="form-control me-2"
              placeholder="Enter task title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <button className="btn btn-success" onClick={handleAdd}>Add</button>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="card shadow">
        <div className="card-body">
          <h5 className="card-title text-primary mb-3">Your Tasks</h5>
          {tasks.length === 0 ? (
            <p className="text-muted">No tasks found.</p>
          ) : (
            <ul className="list-group">
              {tasks.map((task) => (
                <li
                  key={task.id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  {editTaskId === task.id ? (
                    <div className="d-flex w-100 align-items-center">
                      <input
                        type="text"
                        className="form-control me-2"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                      />
                      <button className="btn btn-sm btn-success me-2" onClick={handleUpdate}>Save</button>
                      <button className="btn btn-sm btn-secondary" onClick={() => setEditTaskId(null)}>Cancel</button>
                    </div>
                  ) : (
                    <>
                      <span className="fw-semibold">{task.title}</span>
                      {role === 'admin' && (
                        <div>
                          <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(task)}>Edit</button>
                          <button className="btn btn-sm btn-danger" onClick={() => handleDelete(task.id)}>Delete</button>
                        </div>
                      )}
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
