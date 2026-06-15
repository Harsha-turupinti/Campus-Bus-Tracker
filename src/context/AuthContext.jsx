import React, { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('vce-user')
      const storedToken = localStorage.getItem('vce-token')
      if (storedUser && storedToken) {
        // Set axios default header immediately if token exists
        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`
        return JSON.parse(storedUser)
      }
      return null
    } catch {
      return null
    }
  })

  const login = async ({ email, password, role = 'student' }) => {
    // Admin mock logic (unchanged for now)
    if (role === 'admin') {
      if (email === 'admin@vardhaman.org' && password === 'Admin123!') {
        const nextUser = { email, name: 'Transport Admin', isAdmin: true, role: 'admin' }
        setUser(nextUser)
        localStorage.setItem('vce-user', JSON.stringify(nextUser))
        return nextUser
      }
      throw new Error('Invalid admin credentials')
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email: email.toLowerCase(),
        password
      });

      if (response.data.success) {
        const { token, data: { user: studentData } } = response.data;
        
        // Save token & user
        localStorage.setItem('vce-token', token);
        localStorage.setItem('vce-user', JSON.stringify(studentData));
        
        // Attach token to global axios defaults
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        setUser(studentData);
        return studentData;
      }
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to login. Please try again.');
    }
  }

  const logout = () => {
    setUser(null);
    localStorage.removeItem('vce-user');
    localStorage.removeItem('vce-token');
    delete axios.defaults.headers.common['Authorization'];
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
