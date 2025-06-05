import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Signup.css';

const selectedBtnStyle = {
  backgroundColor: '#198754',
  color: '#fff',
  borderColor: '#000',
};

function Signup() {
  const navigate = useNavigate(); // For navigation after login/signup
  const { signup, login } = useAuth(); // Auth context functions
  const [activeTab, setActiveTab] = useState('login'); // Which tab is active
  const [showAdminForm, setShowAdminForm] = useState(false); // Show admin form or not
  // Signup form state
  const [signupData, setSignupData] = useState({
    userId: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Customer'
  });
  // Customer login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  // Admin login form state
  const [adminData, setAdminData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState(''); // Error message

  // Handle signup input changes
  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle customer login input changes
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle admin login input changes
  const handleAdminChange = (e) => {
    const { name, value } = e.target;
    setAdminData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Validate signup form
  const validateSignupForm = () => {
    if (
        !signupData.userId ||
        !signupData.firstName ||
        !signupData.lastName ||
        !signupData.email ||
        !signupData.password ||
        !signupData.confirmPassword
    ) {
      setError('All fields are required');
      return false;
    }
    if (signupData.password !== signupData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (signupData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(signupData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    return true;
  };

  // Handle signup form submit
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validateSignupForm()) {
      return;
    }
    try {
      await signup(signupData);
      navigate('/'); // Redirect to home after signup
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle customer login form submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!loginData.email || !loginData.password) {
      setError('All fields are required');
      return;
    }
    try {
      await login(loginData.email, loginData.password);
      navigate('/'); // Redirect to home after login
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle admin login form submit
  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!adminData.username || !adminData.password) {
      setError('All fields are required');
      return;
    }
    try {
      await login(adminData.username, adminData.password, 'Admin');
      navigate('/'); // Redirect to home after admin login
    } catch (err) {
      setError(err.message);
    }
  };

  // Render the UI
  return (
      <div className="auth-container">
        <div className="auth-form">
          {error && <div className="error-message">{error}</div>}
          {/* Show form based on active tab */}
          {activeTab === 'signup' ? (
              <form onSubmit={handleSignupSubmit}>
                <h2>Create Account</h2>
                {/* Username input */}
                <div className="form-group">
                  <label htmlFor="userId">Username (ID)</label>
                  <input
                      type="text"
                      name="userId"
                      value={signupData.userId}
                      onChange={handleSignupChange}
                      required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <input
                      type="text"
                      name="firstName"
                      value={signupData.firstName}
                      onChange={handleSignupChange}
                      required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                      type="text"
                      name="lastName"
                      value={signupData.lastName}
                      onChange={handleSignupChange}
                      required
                  />
                </div>
                {/* Email input */}
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                      type="email"
                      id="email"
                      name="email"
                      value={signupData.email}
                      onChange={handleSignupChange}
                      placeholder="Enter your email"
                  />
                </div>
                {/* Password input */}
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                      type="password"
                      id="password"
                      name="password"
                      value={signupData.password}
                      onChange={handleSignupChange}
                      placeholder="Enter your password"
                  />
                </div>
                {/* Confirm password input */}
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={signupData.confirmPassword}
                      onChange={handleSignupChange}
                      placeholder="Confirm your password"
                  />
                </div>
                <button type="submit" className="auth-button">Sign Up</button>
                <div className="auth-switch">
                  Already have an account?{' '}
                  <button
                      type="button"
                      className="switch-link"
                      onClick={() => setActiveTab('login')}
                  >Sign in</button>
                </div>
              </form>
          ) : (
              <form onSubmit={handleLoginSubmit}>
                <h2>Sign In</h2>
                {/* Customer/Admin toggle buttons */}
                <div className="d-flex gap-2 mb-3">
                  <button
                      type="button"
                      className={`btn btn-sm flex-grow-1 border border-dark`}
                      style={!showAdminForm ? selectedBtnStyle : { backgroundColor: '#fff', color: '#000', borderColor: '#000' }}
                      onClick={() => setShowAdminForm(false)}
                  >
                    Customer
                  </button>
                  <button
                      type="button"
                      className={`btn btn-sm flex-grow-1 border border-dark`}
                      style={showAdminForm ? selectedBtnStyle : { backgroundColor: '#fff', color: '#000', borderColor: '#000' }}
                      onClick={() => setShowAdminForm(true)}
                  >
                    Admin
                  </button>
                </div>
                {/* Admin login form */}
                {showAdminForm ? (
                    <>
                      <div className="form-group">
                        <label htmlFor="adminUsername">Username</label>
                        <input
                            type="text"
                            id="adminUsername"
                            name="username"
                            value={adminData.username}
                            onChange={handleAdminChange}
                            placeholder="Enter admin username"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="adminPassword">Password</label>
                        <input
                            type="password"
                            id="adminPassword"
                            name="password"
                            value={adminData.password}
                            onChange={handleAdminChange}
                            placeholder="Enter admin password"
                        />
                      </div>
                      <button
                          type="button"
                          className="auth-button"
                          onClick={handleAdminSubmit}
                      >Sign In as Admin</button>
                    </>
                ) : (
                    <>
                      <div className="form-group">
                        <label htmlFor="loginEmail">Email</label>
                        <input
                            type="email"
                            id="loginEmail"
                            name="email"
                            value={loginData.email}
                            onChange={handleLoginChange}
                            placeholder="Enter your email"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="loginPassword">Password</label>
                        <input
                            type="password"
                            id="loginPassword"
                            name="password"
                            value={loginData.password}
                            onChange={handleLoginChange}
                            placeholder="Enter your password"
                        />
                      </div>
                      <button type="submit" className="auth-button">Sign In</button>
                    </>
                )}
                <div className="auth-switch">
                  Don't have an account?{' '}
                  <button
                      type="button"
                      className="switch-link"
                      onClick={() => setActiveTab('signup')}
                  >Sign up</button>
                </div>
              </form>
          )}
        </div>
      </div>
  );
}

export default Signup;
