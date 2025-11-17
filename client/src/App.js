import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Components/Login";
import ForgotPassword from "./Components/ForgotPassword";
import ResetPassword from "./Components/ResetPassword";
import PageManager from "./Components/PageManager";
import ProtectedRoute from "./Components/ProtectedRoute";
import Cookies from "js-cookie";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login Route - Redirect to dashboard if already logged in */}
        <Route 
          path="/login" 
          element={
            Cookies.get('authToken') ? <Navigate to="/dashboard" replace /> : <Login />
          } 
        />
        
        {/* Forgot Password Route */}
        <Route 
          path="/forgot-password" 
          element={<ForgotPassword />} 
        />
        
        {/* Reset Password Route */}
        <Route 
          path="/reset-password" 
          element={<ResetPassword />} 
        />
        
        {/* Protected Routes - Require authentication */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <PageManager />
            </ProtectedRoute>
          }
        />
        
        {/* Default route - Redirect to login or dashboard */}
        <Route 
          path="/" 
          element={
            Cookies.get('authToken') ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
          } 
        />
        
        {/* Catch all - Redirect to dashboard if authenticated, else login */}
        <Route 
          path="*" 
          element={
            Cookies.get('authToken') ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
