import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import "../styles/Auth.css";

function Login() {
  const navigate = useNavigate();
  const [pseudo, setPseudo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      const response = await authService.login({ pseudo, password });
      localStorage.setItem("token", response.token);
      localStorage.setItem("pseudo", response.pseudo);
      navigate("/");
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Pseudo ou mot de passe incorrect."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Se connecter</h2>
        <p className="auth-description">Heureux de vous revoir !</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="field">
            <label htmlFor="pseudo">Pseudo</label>
            <input
              id="pseudo"
              type="text"
              value={pseudo}
              onChange={(e) => setPseudo(e.target.value)}
              placeholder="Votre pseudo"
              required
            />
          </div>

          <div className="field">
            <label htmlFor="password">Mot de passe</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Votre mot de passe"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" disabled={loading} className="btn-submit">
            {loading ? "Connexion en cours..." : "Se connecter"}
          </button>
        </form>

        <p className="auth-link">
          Pas encore de compte ? <Link to="/inscription">S'inscrire</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;