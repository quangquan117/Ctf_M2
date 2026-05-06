import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import "../styles/Auth.css";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      await authService.login({ email: email.trim(), motDePasse });
      navigate("/");
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Email ou mot de passe incorrect.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">P</div>
        <h2>Connexion</h2>
        <p className="auth-description">
          Heureux de vous revoir sur PollHub.
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="field">
            <label htmlFor="email">Adresse email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vous@exemple.com"
              autoComplete="email"
              required
            />
          </div>

          <div className="field">
            <label htmlFor="motDePasse">Mot de passe</label>
            <input
              id="motDePasse"
              type="password"
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              placeholder="Votre mot de passe"
              autoComplete="current-password"
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