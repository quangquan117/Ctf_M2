import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import "../styles/Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();
  const isAuthenticated = authService.isAuthenticated() && currentUser !== null;

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
            <Link to="/creer-sondage" className="btn-new-poll">
              <span className="btn-new-poll-icon">+</span>
              Nouveau sondage
            </Link>
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