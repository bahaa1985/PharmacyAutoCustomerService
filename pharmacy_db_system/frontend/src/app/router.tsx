import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Pages
import { LoginPage } from "../pages/Login";
import { DashboardPage } from "../pages/Dashboard";
import { MessagesPage } from "../pages/Messages";
import { UsersPage } from "../pages/Users";
import { InventoryPage } from "../pages/Inventory";
import { PharmacyPage } from "../pages/Pharmacy";
import { NotFoundPage } from "../pages/NotFound";

/**
 * Protected route component
 * Redirects to login if user is not authenticated
 */
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  // const [user,setUser] = useState<User>(useAuth().user||undefined)
  // setUser(useAuth().user||undefined)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

/**
 * App Router Configuration
 * Handles all routing and protected routes
 */
export const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        {useAuth().user?.role_id === 1 && (
          <Route
            path="/pharmacy"
            element={
              <ProtectedRoute>
                <PharmacyPage />
              </ProtectedRoute>
            }
          />
        )}

        <Route
          path="/messages"
          element={
            <ProtectedRoute>
              <MessagesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <UsersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inventory"
          element={
            <ProtectedRoute>
              <InventoryPage />
            </ProtectedRoute>
          }
        />

        {/* Fallback Routes */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};
