
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

// Component to protect routes that require admin privileges
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-linkedin-blue"></div>
      </div>
    );
  }
  
  // Redirect to dashboard if not authenticated or not an admin
  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/" />;
  }
  
  // Render children if authenticated and has admin role
  return <>{children}</>;
};

export default AdminRoute;
