import { useState, useEffect, createContext, useContext } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: {
    phoneNumber: string;
    name: string;
  } | null;
  login: (phoneNumber: string, pin: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<{ phoneNumber: string; name: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      const session = localStorage.getItem('adminSession');
      if (session) {
        try {
          const sessionData = JSON.parse(session);
          // Validate session with backend
          const response = await fetch('/api/auth/validate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId: sessionData.sessionId }),
          });
          
          if (response.ok) {
            const data = await response.json();
            setIsAuthenticated(true);
            setUser({ phoneNumber: data.phoneNumber, name: data.name });
          } else {
            localStorage.removeItem('adminSession');
          }
        } catch (error) {
          console.error('Error validating session:', error);
          localStorage.removeItem('adminSession');
        }
      }
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  const login = async (phoneNumber: string, pin: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, pin }),
      });
      
      if (!response.ok) {
        throw new Error('Invalid credentials');
      }
      
      const data = await response.json();
      localStorage.setItem('adminSession', JSON.stringify(data));
      setIsAuthenticated(true);
      setUser({ phoneNumber: data.phoneNumber, name: data.name });
      router.push('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('adminSession');
    setIsAuthenticated(false);
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}