import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import "../styles/PollDetail.css";

type PollOption = {
  id: number;
  texte: string;
};

type Poll = {
  id: number;
  titre: string;
  description: string;
  lienPartage: string;
  dateFermeture: string;
  multiReponse: boolean;
  options: PollOption[];
};

export default function PollDetail() {
  const { id } = useParams();

  const [poll, setPoll] = useState<Poll | null>(null);
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const response = await api.get(`/sondages/${id}`);
        setPoll(response.data);

        const votedPolls = JSON.parse(localStorage.getItem("votedPolls") || "[]");

        if (votedPolls.includes(id)) {
          setHasVoted(true);
          setMessage("Tu as déjà voté pour ce sondage.");
        }
      } catch (error) {
        setMessage("Impossible de charger le sondage.");
      } finally {
        setLoading(false);
      }
    };

    fetchPoll();
  }, [id]);

  const handleVote = async () => {
    if (!selectedOptionId) {
      setMessage("Choisis une réponse avant de voter.");
      return;
    }

    try {
      await api.post(`/sondages/${id}/vote`, {
        idOptions: [selectedOptionId],
      });

      const votedPolls = JSON.parse(localStorage.getItem("votedPolls") || "[]");
      localStorage.setItem("votedPolls", JSON.stringify([...votedPolls, id]));

      setHasVoted(true);
      setMessage("Vote enregistré avec succès !");
    } catch (error: any) {
      if (error.response?.status === 409) {
        setMessage("Tu as déjà voté pour ce sondage.");
        setHasVoted(true);
      } else if (error.response?.status === 401) {
        setMessage("Tu dois être connecté pour voter.");
      } else if (error.response?.status === 410) {
        setMessage("Ce sondage est fermé.");
      } else {
        setMessage("Erreur : vote impossible.");
      }
    }
  };

  if (loading) {
    return <p>Chargement du sondage...</p>;
  }

  if (!poll) {
    return <p>{message}</p>;
  }

  return (
    <main className="poll-page">
      <div className="poll-container">
        <h1 className="poll-title">{poll.titre}</h1>

        {poll.description && (
          <p className="poll-description">{poll.description}</p>
        )}

        <div className="poll-options">
          {poll.options.map((option) => (
            <div className="poll-option" key={option.id}>
              <label>
                <input
                  type="radio"
                  name="vote"
                  value={option.id}
                  checked={selectedOptionId === option.id}
                  disabled={hasVoted}
                  onChange={() => setSelectedOptionId(option.id)}
                />
                {option.texte}
              </label>
            </div>
          ))}
        </div>

        <button
          className="vote-button"
          onClick={handleVote}
          disabled={hasVoted}
        >
          {hasVoted ? "Vote déjà envoyé" : "Voter"}
        </button>

        {message && <p className="vote-message">{message}</p>}
      </div>
    </main>
  );
}