import { Link } from "react-router-dom";
import "../styles/Home.css";

function Home() {
  return (
    <div className="home">
      <section className="hero">
        <h1>Créez et partagez vos sondages en quelques secondes</h1>
        <p className="subtitle">
          Posez une question, partagez le lien, recueillez les votes.
          Simple, rapide, efficace.
        </p>
        <div className="hero-buttons">
          <Link to="/inscription" className="btn-primary">
            Commencer gratuitement
          </Link>
          <Link to="/connexion" className="btn-secondary">
            J'ai déjà un compte
          </Link>
        </div>
      </section>

      <section className="features">
        <div className="card">
          <div className="icon">✏️</div>
          <h3>Créez</h3>
          <p>Créez un sondage avec plusieurs options en un clic.</p>
        </div>
        <div className="card">
          <div className="icon">🔗</div>
          <h3>Partagez</h3>
          <p>Envoyez le lien à vos amis, votre équipe, votre famille.</p>
        </div>
        <div className="card">
          <div className="icon">📊</div>
          <h3>Analysez</h3>
          <p>Visualisez les résultats en temps réel.</p>
        </div>
      </section>
    </div>
  );
}

export default Home;