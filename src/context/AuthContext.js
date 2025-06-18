import { createContext, useContext, useState, useEffect } from "react";
import { getTokens } from "../utils/storage";
import axios from 'axios';
import { API_BASE_URL } from '../../config';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const { accessToken } = await getTokens();
        
        if (accessToken) {
          // Verify token and fetch user data
          const response = await axios.get(`${API_BASE_URL}/api/v1/users/me`, {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          });
          
          if (response.data?.data) {
            setUser(response.data.data);
          }
        }
      } catch (error) {
        console.error('Error loading user:', error);
        // Clear tokens if they're invalid
        if (error.response?.status === 401) {
          await clearTokens();
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const value = {
    user,
    setUser,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useUser = () => useContext(AuthContext);