export interface ProtectedRouteProps {
  children: React.ReactNode;
  accessAuth?: boolean;
  redirectTo?: string;
}
