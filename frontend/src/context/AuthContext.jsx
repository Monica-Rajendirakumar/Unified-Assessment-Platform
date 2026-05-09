import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Safely parse JWT payload without needing an external library
  const parseJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = parseJwt(token);
      // Ensure token exists and is not expired
      if (decoded && decoded.exp * 1000 > Date.now()) {
        setUser({ ...decoded, token });
      } else {
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token);
    const decoded = parseJwt(token);
    setUser({ ...decoded, token });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const updateUser = (updatedUserData) => {
    // If a new token is provided, update it
    if (updatedUserData.token) {
      localStorage.setItem('token', updatedUserData.token);
    }
    
    // Merge existing user data with updates
    setUser(prev => ({
      ...prev,
      ...updatedUserData
    }));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, updateUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
