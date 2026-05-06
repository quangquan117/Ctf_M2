import { Link } from "react-router-dom";
import { authService } from "../services/authService";
import "../styles/Home.css";

function Home() {

  const isAuthenticated =
    authService.isAuthenticated() && authService.getCurrentUser() !== null;

  const ctaLink = isAuthenticated ? "/creer-sondage" : "/inscription";
  const ctaLabel = isAuthenticated
    ? "Créer un sondage maintenant"
    : "Créer un sondage gratuitement";

  return (
    <div className="home">
      {/* Section principale */}
      <section className="hero">
        <div className="hero-badge">
          <span className="hero-badge-dot"></span>
          Sondages instantanés
        </div>
        <h1>
          Recueillez l'avis de vos proches
          <br />
          <span className="hero-highlight">en moins d'une minute.</span>
        </h1>
        <p className="subtitle">
          Créez un sondage, partagez un lien, et observez les réponses tomber
          en temps réel. Aucune installation, juste un navigateur.
        </p>
        <div className="hero-buttons">
          <Link to={ctaLink} className="btn-primary">
            {ctaLabel}
            <span className="btn-arrow">→</span>
          </Link>
          {!isAuthenticated && (
            <Link to="/connexion" className="btn-secondary">
              J'ai déjà un compte
            </Link>
          )}
        </div>
      </section>

      {/* Section fonctionnalités */}
      <section className="features">
        <div className="card">
          <div className="icon-wrapper">
            <span className="icon">✏️</span>
          </div>
          <h3>Créez en un instant</h3>
          <p>
            Posez votre question, ajoutez vos options, c'est prêt.
            Pas de paramètres compliqués.
          </p>
        </div>
        <div className="card card-featured">
          <div className="icon-wrapper">
            <span className="icon">🔗</span>
          </div>
          <h3>Partagez un simple lien</h3>
          <p>
            Envoyez le lien par message, par mail, ou en story. Vos amis
            votent en un clic.
          </p>
        </div>
        <Link to="/resultats" className="card card-link">
          <div className="icon-wrapper">
            <span className="icon">📊</span>
          </div>
          <h3>Suivez les résultats</h3>
          <p>
            Visualisez les votes en direct. Décidez ensemble, plus vite,
            sans débat interminable.
          </p>
        </Link>
      </section>

      {/* Section CTA */}
      <section className="cta">
        <h2>
          {isAuthenticated
            ? "Prêt à lancer votre prochain sondage ?"
            : "Prêt à lancer votre premier sondage ?"}
        </h2>
        <p>
          {isAuthenticated
            ? "Posez une question, partagez le lien, c'est parti."
            : "Inscrivez-vous, c'est gratuit et ça prend 30 secondes."}
        </p>
        <Link to={ctaLink} className="btn-primary btn-large">
          {isAuthenticated ? "Créer un sondage" : "Commencer maintenant"}
        </Link>
      </section>
    </div>
  );
}

export default Home;