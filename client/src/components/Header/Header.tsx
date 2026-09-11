import { Link, useLocation } from 'react-router-dom';
import logo from '../../images/logo.svg'; 

interface HeaderProps {
  loggedIn: boolean;
  userEmail: string;
  onSignOut: () => void;
}

function Header({ loggedIn, userEmail, onSignOut }: HeaderProps) {
  const location = useLocation();

  return (
    <header className="header page__section">
      <img 
        alt="Logotipo Around The U.S." 
        className="logo header__logo" 
        src={logo} 
      />
      
      <div className="header__nav">
        {loggedIn ? (
          <>
            <span className="header__email">{userEmail}</span>
            <button onClick={onSignOut} className="header__signout">
              Cerrar sesión
            </button>
          </>
        ) : (
          location.pathname === '/signin' ? (
            <Link to="/signup" className="header__link">Regístrate</Link>
          ) : (
            <Link to="/signin" className="header__link">Inicia sesión</Link>
          )
        )}
      </div>
    </header>
  );
}

export default Header;