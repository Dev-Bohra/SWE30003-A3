import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the Auth context
const AuthContext = createContext();

// Custom hook for easy context usage
export function useAuth() {
  return useContext(AuthContext);
}

// Provider: supplies authentication state and functions to the whole app
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null); // The currently logged-in user

  useEffect(() => {
    // On page load, restore user from localStorage if available
    const user = localStorage.getItem('currentUser');
    if (user) {
      const parsedUser = JSON.parse(user);
      setCurrentUser(parsedUser);
    }
  }, []);

  // Signup function: register a new user
  const signup = (userData) => {
    // Load existing users
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    // Check for duplicate email
    if (users.some(user => user.email === userData.email)) {
      throw new Error('Email already exists');
    }
    // Add new user
    users.push(userData);
    localStorage.setItem('users', JSON.stringify(users));
    // Auto-login after signup
    login(userData.email, userData.password);
  };

  // Login function: handles both user and admin login
  const login = (email, password, role) => {
    // Mock admin login check
    if (role === 'Admin') {
      if (email === 'admin' && password === 'password') {
        const adminUser = {
          username: 'admin',
          role: 'Admin'
        };
        setCurrentUser(adminUser);
        localStorage.setItem('currentUser', JSON.stringify(adminUser));
        return;
      }
      throw new Error('Invalid admin credentials');
    }
    // Regular user login check
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
      throw new Error('Invalid email or password');
    }
    // Remove password before storing in state
    const { password: _, ...userWithoutPassword } = user;
    setCurrentUser(userWithoutPassword);
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
  };

  // Logout function
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  // Context value to be provided
  const value = {
    currentUser,
    signup,
    login,
    logout
  };

  // Return the provider
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
} 