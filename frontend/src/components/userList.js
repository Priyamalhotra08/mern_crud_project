import React, { useState } from 'react';
import './userList.css';

const UserList = ({ users, onEdit, onDelete, loading }) => {
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Handle delete confirmation
  const handleDeleteClick = (user) => {
    setDeleteConfirm(user);
  };

  const handleDeleteConfirm = () => {
    if (deleteConfirm) {
      onDelete(deleteConfirm._id);
      setDeleteConfirm(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm(null);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  if (loading) {
    return (
      <div className="user-list-container">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="user-list-container">
      <div className="user-list-header">
        <h2>User Directory</h2>
        <p className="user-count">
          {users.length === 0 ? 'No users found' : `${users.length} user${users.length !== 1 ? 's' : ''} found`}
        </p>
      </div>

      {users.length === 0 ? (
        <div className="no-users">
          <div className="no-users-icon">👥</div>
          <h3>No Users Found</h3>
          <p>Get started by creating your first user!</p>
        </div>
      ) : (
        <div className="users-grid">
          {users.map((user) => (
            <div key={user._id} className="user-card">
              <div className="user-header">
                <h3 className="user-name">{user.name}</h3>
                <div className="user-actions">
                  <button 
                    onClick={() => onEdit(user)}
                    className="btn btn-edit"
                    title="Edit user"
                  >
                    ✏️ Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteClick(user)}
                    className="btn btn-delete"
                    title="Delete user"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
              
              <div className="user-details">
                <div className="user-detail-item">
                  <span className="label">Company:</span>
                  <span className="value">{user.companyName}</span>
                </div>
                <div className="user-detail-item">
                  <span className="label">Phone:</span>
                  <span className="value">{user.phoneNumber}</span>
                </div>
                <div className="user-detail-item">
                  <span className="label">Address:</span>
                  <span className="value">{user.address}</span>
                </div>
                <div className="user-timestamps">
                  <small className="created-date">
                    Created: {formatDate(user.createdAt)}
                  </small>
                  {user.updatedAt !== user.createdAt && (
                    <small className="updated-date">
                      Updated: {formatDate(user.updatedAt)}
                    </small>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Confirm Delete</h3>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete <strong>{deleteConfirm.name}</strong>?</p>
              <p>This action cannot be undone.</p>
            </div>
            <div className="modal-actions">
              <button 
                onClick={handleDeleteConfirm}
                className="btn btn-delete"
              >
                Yes, Delete
              </button>
              <button 
                onClick={handleDeleteCancel}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;