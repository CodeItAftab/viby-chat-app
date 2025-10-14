import { useAuth } from "@/hooks/auth";
import { useLocation, Navigate } from "react-router-dom";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isLoggedIn, isLoading } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname;

  // --- Route Definitions ---
  const publicAuthRoutes: string[] = [];
  const isPublicAuthRoute =
    publicAuthRoutes.includes(currentPath) ||
    currentPath.startsWith("/auth/reset-password/");

  // Check if the current path is a login or register route
  const isLoginRegisterRoute =
    currentPath === "/auth/login" ||
    currentPath === "/auth/register" ||
    currentPath === "/auth/forgot-password";

  // --- Core Logic ---

  if (isLoading) {
    // For auth routes, don't show global loading - let the form handle its own loading state
    if (isLoginRegisterRoute || isPublicAuthRoute) {
      return <>{children}</>;
    }

    return (
      <div className="flex min-h-screen w-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (isLoggedIn) {
    if (isLoginRegisterRoute) {
      return <Navigate to="/" replace />;
    }

    if (isPublicAuthRoute) {
      return <>{children}</>;
    }
    return <>{children}</>;
  }

  if (isPublicAuthRoute) {
    return <>{children}</>;
  }
  if (isLoginRegisterRoute) {
    return <>{children}</>;
  }

  return <Navigate to="/auth/login" replace />;
};

export { ProtectedRoute };
