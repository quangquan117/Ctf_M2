import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import "../styles/Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const isAuthenticated = authService.isAuthenticated();
  const currentUser = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        <span className="logo-icon">P</span>
        PollHub
      </Link>
      <div className="links">
        {isAuthenticated && currentUser ? (
          <>
            <span className="welcome">
              Bonjour, <span className="welcome-name">{currentUser.nom}</span>
            </span>
            <button onClick={handleLogout} className="btn-logout">
              Déconnexion
            </button>
          </>
        ) : (
          <>
            <Link to="/connexion">Connexion</Link>
            <Link to="/inscription" className="btn-register">
              Inscription
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;