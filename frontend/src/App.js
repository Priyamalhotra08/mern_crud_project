import React, { useState, useEffect } from 'react';
import UserForm from './components/userForm';
import UserList from './components/userList';
import { userAPI } from './services/api';
import './App.css';

function App() {
  // State Management
  const [users, setUsers] = useState([]);
  const [currentView, setCurrentView] = useState('view'); // 'view', 'create', 'update'
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

 

  // Fetch all users from API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getAllUsers();
      setUsers(response.data.data);
    } catch (error) {
      showMessage('Error fetching users: ' + (error.response?.data?.message || error.message), 'error');
    } finally {
      setLoading(false);
    }
  };
 // Load users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);
  
  // Show message to user
  const showMessage = (text, type = 'info') => {
    setMessage({ text, type });
    // Auto-hide message after 5 seconds
    setTimeout(() => setMessage({ text: '', type: '' }), 5000);
  };

  // Handle create user
  const handleCreateUser = async (userData) => {
    try {
      const response = await userAPI.createUser(userData);
      // Add new user to the beginning of the list
      setUsers([response.data.data, ...users]);
      showMessage('User created successfully!', 'success');
      setCurrentView('view');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.errors?.join(', ') || 
                          error.message;
      showMessage('Error creating user: ' + errorMessage, 'error');
      throw error; // Re-throw to handle in form component
    }
  };

  // Handle update user
  const handleUpdateUser = async (userData) => {
    try {
      const response = await userAPI.updateUser(selectedUser._id, userData);
      // Update the user in the list
      const updatedUsers = users.map(user => 
        user._id === selectedUser._id ? response.data.data : user
      );
      setUsers(updatedUsers);
      showMessage('User updated successfully!', 'success');
      setCurrentView('view');
      setSelectedUser(null);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.errors?.join(', ') || 
                          error.message;
      showMessage('Error updating user: ' + errorMessage, 'error');
      throw error; // Re-throw to handle in form component
    }
  };

  // Handle delete user
  const handleDeleteUser = async (userId) => {
    try {
      await userAPI.deleteUser(userId);
      // Remove user from the list
      const filteredUsers = users.filter(user => user._id !== userId);
      setUsers(filteredUsers);
      showMessage('User deleted successfully!', 'success');
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      showMessage('Error deleting user: ' + errorMessage, 'error');
    }
  };

  // Handle edit user (set selected user and change view)
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setCurrentView('update');
  };

  // Handle cancel edit (reset selected user and return to view)
  const handleCancelEdit = () => {
    setSelectedUser(null);
    setCurrentView('view');
  };

  // Handle view change
  const handleViewChange = (view) => {
    setCurrentView(view);
    // Reset selected user if not updating
    if (view !== 'update') {
      setSelectedUser(null);
    }
  };

  // Clear message manually
  const clearMessage = () => {
    setMessage({ text: '', type: '' });
  };

  return (
    <div className="App">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <h1>🔧 MERN CRUD Application</h1>
          <p>Complete User Management System with Full CRUD Operations</p>
        </div>
      </header>

      {/* Navigation */}
      <nav className="app-nav">
        <div className="nav-container">
          <button 
            onClick={() => handleViewChange('view')}
            className={`nav-btn ${currentView === 'view' ? 'active' : ''}`}
            disabled={loading}
          >
            📋 View Users ({users.length})
          </button>
          <button 
            onClick={() => handleViewChange('create')}
            className={`nav-btn ${currentView === 'create' ? 'active' : ''}`}
            disabled={loading}
          >
            ➕ Create User
          </button>
          {currentView === 'update' && selectedUser && (
            <button className="nav-btn active">
              ✏️ Update User: {selectedUser.name}
            </button>
          )}
        </div>
      </nav>

      {/* Message Display */}
      {message.text && (
        <div className={`message-bar ${message.type}`}>
          <span>{message.text}</span>
          <button 
            onClick={clearMessage}
            className="message-close"
            aria-label="Close message"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Content */}
      <main className="app-main">
        <div className="main-container">
          {/* View Users */}
          {currentView === 'view' && (
            <UserList
              users={users}
              onEdit={handleEditUser}
              onDelete={handleDeleteUser}
              loading={loading}
            />
          )}

          {/* Create User */}
          {currentView === 'create' && (
            <UserForm
              onSubmit={handleCreateUser}
              isEdit={false}
            />
          )}

          {/* Update User */}
          {currentView === 'update' && selectedUser && (
            <UserForm
              user={selectedUser}
              onSubmit={handleUpdateUser}
              onCancel={handleCancelEdit}
              isEdit={true}
            />
          )}

          {/* Error state when trying to update without selected user */}
          {currentView === 'update' && !selectedUser && (
            <div className="error-state">
              <h2>⚠️ Error</h2>
              <p>No user selected for editing.</p>
              <button 
                onClick={() => handleViewChange('view')} 
                className="btn btn-primary"
              >
                Return to User List
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-content">
          <p>&copy; 2024 MERN CRUD App - Built with React, Node.js, Express & MongoDB</p>
          <p>
            <small>
              Features: Create, Read, Update, Delete | 
              Responsive Design | 
              Form Validation | 
              Real-time Updates
            </small>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;