import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import React from "react";

/**
 * ProtectedRoute component that ensures only authenticated admins can access its children.
 * It checks the session status by calling the /admin/me endpoint.
 */
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [, setLocation] = useLocation();

  // Check authentication status
  const { data: admin, isLoading, isError } = useQuery({
    queryKey: ["/api/admin/me"],
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If not authenticated or error, redirect to login
  if (isError || !admin) {
    setLocation("/admin/login");
    return null;
  }

  return <>{children}</>;
}
