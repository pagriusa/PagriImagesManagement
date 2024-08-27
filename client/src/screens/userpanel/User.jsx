// src/components/AddUser.js

import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { Navigate, useNavigate } from 'react-router-dom';

export default function User() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    userrole: '', // Initialize userrole
  });

  const [userData, setUserData] = useState([]);

  const fetchUserData = async() => {
    try {
      const response = await fetch('https://pagriimagesmanagement.onrender.com/api/getuserData');
      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

   // Function to handle deleting a user
   const deleteUser = async (userId) => {
    try {
      const response = await fetch(`https://pagriimagesmanagement.onrender.com/api//deleteUser/${userId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        // Remove the deleted user from the state
        setUserData(userData.filter(user => user._id !== userId));
      } else {
        console.error('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };


  useEffect(() => {
    fetchUserData();
  }, [])
  

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(''); // Clear errors on input change
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    // Simple client-side validation
    if (!formData.userrole) {
      setError('Please select a user role.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('https://pagriimagesmanagement.onrender.com/api/addUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage('User added successfully!');
        setFormData({
          name: '',
          email: '',
          password: '',
          userrole: '',
        });

      navigate('/userpanel/User')
      } else {
        setError(result.message || 'Failed to add user.');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">

      <Navbar />

      <div className='row'>
        <div className='col-md-6'>
        <h2 className="mb-4">Add New User</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}
      <form onSubmit={handleSubmit} style={{ maxWidth: '500px', margin: 'auto' }}>
        {/* Name Field */}
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name<span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter full name"
          />
        </div>

        {/* Email Field */}
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email<span className="text-danger">*</span>
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Enter email address"
          />
        </div>

        {/* Password Field */}
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password<span className="text-danger">*</span>
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Enter password"
          />
        </div>

        {/* User Role Field */}
        <div className="mb-3">
          <label htmlFor="userrole" className="form-label">
            User Role<span className="text-danger">*</span>
          </label>
          <select
            id="userrole"
            name="userrole"
            value={formData.userrole}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="">Select User Role</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
        </div>

        {/* Submit Button */}
        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
          {loading ? 'Adding User...' : 'Add User'}
        </button>
      </form>

        </div>
        <div className='col-md-6'>

          <h2>User List</h2>
          <div className='table-responsive'>
            <table className="table table-striped table-bordered">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
          {userData.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button className='btn btn-danger' onClick={() => deleteUser(user._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
            </table>
          </div>

        </div>

      </div>
      
    </div>
  );
}
