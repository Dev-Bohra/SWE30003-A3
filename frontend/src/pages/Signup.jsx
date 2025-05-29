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
  const navigate = useNavigate();
  const { signup, login } = useAuth();
  const [activeTab, setActiveTab] = useState('login');
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [signupData, setSignupData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Customer'
  });
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [adminData, setAdminData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAdminChange = (e) => {
    const { name, value } = e.target;
    setAdminData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateSignupForm = () => {
    if (!signupData.username || !signupData.email || !signupData.password || !signupData.confirmPassword) {
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

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateSignupForm()) {
      return;
    }

    try {
      await signup(signupData);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!loginData.email || !loginData.password) {
      setError('All fields are required');
      return;
    }

    try {
      await login(loginData.email, loginData.password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!adminData.username || !adminData.password) {
      setError('All fields are required');
      return;
    }

    try {
      await login(adminData.username, adminData.password, 'Admin');
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        {error && <div className="error-message">{error}</div>}

        {activeTab === 'signup' ? (
          <form onSubmit={handleSignupSubmit}>
            <h2>Create Account</h2>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={signupData.username}
                onChange={handleSignupChange}
                placeholder="Enter your username"
              />
            </div>

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
              Already have an account? <button type="button" className="switch-link" onClick={() => setActiveTab('login')}>Sign in</button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleLoginSubmit}>
            <h2>Sign In</h2>
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

                <button type="button" className="auth-button" onClick={handleAdminSubmit}>Sign In as Admin</button>
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
              Don't have an account? <button type="button" className="switch-link" onClick={() => setActiveTab('signup')}>Sign up</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default Signup; 