import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  loggedIn: boolean;
  children: React.JSX.Element;
}

function ProtectedRoute({ loggedIn, children }: ProtectedRouteProps): React.JSX.Element {
  if (!loggedIn) {
    // Si no está logueado, lo redirige a signin
    return <Navigate to="/signin" replace />;
  }
  
  // Si está logueado, renderiza el componente hijo (tu aplicación principal)
  return children;
}

export default ProtectedRoute;