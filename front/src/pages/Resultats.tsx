import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import api from "../api/axios";
import "../styles/Resultats.css";

type OptionResult = {
  id: number;
  texte: string;
  votes: number;
};

type SondageResult = {
  id: number;
  titre: string;
  lienPartage: string;
  totalVotes: number;
  options: OptionResult[];
};

function Resultats() {
  const { lienPartage } = useParams<{ lienPartage: string }>();
  const [results, setResults] = useState<SondageResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchResults = async () => {
    if (!lienPartage) return;
    try {
      setError(null);
      const response = await api.get(`/sondages/${lienPartage}/resultats`);
      setResults(response.data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const message =
          typeof err.response?.data === "string"
            ? err.response.data
            : err.response?.data?.message;
        setError(message || "Impossible de charger les résultats du sondage");
      } else {
        setError("Une erreur inattendue s'est produite");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lienPartage]);

  // Trouve le maximum pour mettre en évidence l'option gagnante
  const maxVotes =
    results && results.options.length > 0
      ? Math.max(...results.options.map((o) => o.votes))
      : 0;

  const getPercentage = (votes: number) => {
    if (!results || results.totalVotes === 0) return 0;
    return Math.round((votes / results.totalVotes) * 100);
  };

  if (loading) {
    return (
      <main className="resultats-page">
        <section className="resultats-card">
          <p className="resultats-loading">Chargement des résultats...</p>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="resultats-page">
        <section className="resultats-card">
          <h1>Résultats indisponibles</h1>
          <div className="resultats-error">{error}</div>
          <Link to="/" className="resultats-back">
            ← Retour à l'accueil
          </Link>
        </section>
      </main>
    );
  }

  if (!results) {
    return null;
  }

  return (
    <main className="resultats-page">
      <section className="resultats-card">
        <header className="resultats-header">
          <h1>{results.titre}</h1>
          <p className="resultats-total">
            <span className="resultats-total-number">{results.totalVotes}</span>
            {results.totalVotes > 1 ? " votes au total" : " vote au total"}
          </p>
        </header>

        {results.totalVotes === 0 ? (
          <p className="resultats-empty">
            Aucun vote pour le moment. Partagez le lien du sondage pour récolter
            les premiers avis !
          </p>
        ) : (
          <ul className="resultats-list">
            {results.options.map((option) => {
              const percentage = getPercentage(option.votes);
              const isWinner = option.votes === maxVotes && option.votes > 0;
              return (
                <li
                  key={option.id}
                  className={`resultats-item ${isWinner ? "winner" : ""}`}
                >
                  <div className="resultats-item-header">
                    <span className="resultats-item-text">{option.texte}</span>
                    <span className="resultats-item-stats">
                      {option.votes} {option.votes > 1 ? "votes" : "vote"} •{" "}
                      {percentage}%
                    </span>
                  </div>
                  <div className="resultats-bar">
                    <div
                      className="resultats-bar-fill"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        <div className="resultats-actions">
          <button
            type="button"
            className="resultats-refresh"
            onClick={() => {
              setLoading(true);
              fetchResults();
            }}
          >
            ⟳ Rafraîchir
          </button>
          <Link to="/" className="resultats-back">
            ← Retour à l'accueil
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Resultats;