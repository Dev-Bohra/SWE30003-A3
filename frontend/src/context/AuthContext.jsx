import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginCustomer, registerCustomer } from '../api/customerApi';

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
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  // Signup function: register a new user
  const signup = async ({ userId, firstName, lastName, email }) => {
    const customer = await registerCustomer({ userId, firstName, lastName, email }); // ✅ UPDATED

    const newUser = {
      id: customer.customerInfo.id,
      firstName: customer.customerInfo.firstName,
      lastName: customer.customerInfo.lastName,
      email: customer.customerInfo.email,
      role: 'Customer'
    };

    setCurrentUser(newUser);
    localStorage.setItem("currentUser", JSON.stringify(newUser));
  };

  // Login function: handles both user and admin login
  const login = async (email, password, role) => {
    // Mock admin login check
    if (role === 'Admin') {
      if (email === 'admin@com' && password === 'password') {
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

    const customerInfo = await loginCustomer(email, password); // ✅ UPDATED

    const user = {
      id: customerInfo.id,
      firstName: customerInfo.firstName,
      lastName: customerInfo.lastName,
      email: customerInfo.email,
      role: "Customer"
    };

    setCurrentUser(user);
    localStorage.setItem("currentUser", JSON.stringify(user));
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
