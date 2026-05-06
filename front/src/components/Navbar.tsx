import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import "../styles/Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const isAuthenticated = authService.isAuthenticated();
  const pseudo = localStorage.getItem("pseudo");

  const handleLogout = () => {
    authService.logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        🗳️ MonSondage
      </Link>
      <div className="links">
        {isAuthenticated ? (
          <>
            <span className="welcome">Bonjour, {pseudo}</span>
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