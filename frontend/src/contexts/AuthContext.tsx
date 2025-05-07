import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import axiosInstance from '@/utils/axiosInstance';

// Mock authentication functions (replace with actual API calls in production)
const loginApi = async (email: string, password: string): Promise<{ user: User; token: string }> => {
  try {
    const response = await axiosInstance.post('/auth/login', { email, password });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

const registerApi = async (name: string, email: string, password: string): Promise<{ user: User; token: string }> => {
  try {
    const response = await axiosInstance.post('/auth/register', { name, email, password });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};

// Create auth context
interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  addCredits: (amount: number) => void;
  subtractCredits: (amount: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });
  const { toast } = useToast();

  // Check for stored auth on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      try {
        setAuthState({
          user: JSON.parse(storedUser),
          token: storedToken,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (error) {
        // Invalid stored data
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setAuthState({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      const { user, token } = await loginApi(email, password);
      
      // Store in localStorage
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      
      // Update state
      setAuthState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
      
      toast({
        title: 'Login successful',
        description: `Welcome back, ${user.name}!`,
      });
    } catch (error) {
      toast({
        title: 'Login failed',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
      throw error;
    }
  };

  // Register function
  const register = async (name: string, email: string, password: string) => {
    try {
      const { user, token } = await registerApi(name, email, password);
      
      // Store in localStorage
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      
      // Update state
      setAuthState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
      
      toast({
        title: 'Registration successful',
        description: `Welcome to LearnHub, ${user.name}!`,
      });
    } catch (error) {
      toast({
        title: 'Registration failed',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    // Clear localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    // Update state
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
    
    toast({
      title: 'Logout successful',
      description: 'You have been logged out.',
    });
  };

  // Credit management functions
  const addCredits = (amount: number) => {
    if (!authState.user) return;
    
    const updatedUser = {
      ...authState.user,
      credits: authState.user.credits + amount,
    };
    
    // Update localStorage
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    // Update state
    setAuthState(prev => ({
      ...prev,
      user: updatedUser,
    }));
    
    toast({
      title: 'Credits added',
      description: `${amount} credits have been added to your account.`,
    });
  };

  const subtractCredits = (amount: number) => {
    if (!authState.user) return;
    
    if (authState.user.credits < amount) {
      toast({
        title: 'Insufficient credits',
        description: 'You do not have enough credits for this action.',
        variant: 'destructive',
      });
      return;
    }
    
    const updatedUser = {
      ...authState.user,
      credits: authState.user.credits - amount,
    };
    
    // Update localStorage
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    // Update state
    setAuthState(prev => ({
      ...prev,
      user: updatedUser,
    }));
    
    toast({
      title: 'Credits used',
      description: `${amount} credits have been deducted from your account.`,
    });
  };

  // Provide auth context
  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        register,
        logout,
        addCredits,
        subtractCredits,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
