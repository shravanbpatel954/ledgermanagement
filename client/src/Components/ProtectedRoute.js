import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const ProtectedRoute = ({ children }) => {
  // Check if user has valid token in cookie
  const token = Cookies.get('authToken');
  const user = sessionStorage.getItem('user');

  const inactiveUsernames = (() => {
    if (typeof window === 'undefined') {
      return [];
    }
    try {
      const stored = localStorage.getItem('inactiveUsernames');
      const parsed = stored ? JSON.parse(stored) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  })();

  if (user) {
    try {
      const parsedUser = JSON.parse(user);
      const usernameKey = (parsedUser?.username || '').toLowerCase();
      if (inactiveUsernames.includes(usernameKey)) {
        Cookies.remove('authToken', { path: '/' });
        sessionStorage.clear();
        return <Navigate to="/login" replace />;
      }
    } catch {
      // Ignore parsing errors and fall back to default auth check
    }
  }

  // If no token or user, redirect to login
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // User is authenticated, render the protected content
  return children;
};

export default ProtectedRoute;

