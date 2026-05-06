import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/RechercheResultats.css";

function RechercheResultats() {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const trimmed = input.trim();
    if (!trimmed) {
      setError("Veuillez entrer un lien ou un identifiant de sondage");
      return;
    }

    // Si l'utilisateur colle l'URL complète, on extrait juste le lienPartage (UUID)
    // Format possible : http://10.190.4.90:8081/sondages/<uuid>
    const parts = trimmed.split("/");
    const lienPartage = parts[parts.length - 1];

    if (!lienPartage) {
      setError("Lien invalide");
      return;
    }

    navigate(`/sondages/${lienPartage}/resultats`);
  };

  return (
    <main className="recherche-page">
      <section className="recherche-card">
        <header className="recherche-header">
          <h1>Voir les résultats d'un sondage</h1>
          <p>Collez le lien du sondage pour consulter ses résultats.</p>
        </header>

        <form onSubmit={handleSubmit} className="recherche-form">
          <label htmlFor="lien">Lien du sondage</label>
          <input
            id="lien"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="ex : http://10.190.4.90:8081/sondages/abc-123-..."
            autoFocus
          />

          {error && <div className="recherche-error">{error}</div>}

          <button type="submit" className="recherche-submit">
            Voir les résultats →
          </button>
        </form>

        <Link to="/" className="recherche-back">
          ← Retour à l'accueil
        </Link>
      </section>
    </main>
  );
}

export default RechercheResultats;