import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { fetchWithAuth } from "../services/api";

import "./SessionDetails.css";

type Session = {
  id: number;
  user_id: number;
  username: string;
  date: string;
  room: string;
  buy_in: number;
  cash_out: number;
  duration: number;
  game_type: string;
  technical_rating: number;
  mental_rating: number;
  notes: string;
  tags: { id: number; name: string }[];
};

function SessionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    fetchWithAuth(`/sessions/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Session introuvable");
        return res.json();
      })
      .then((data) => {
        setSession(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Erreur lors du chargement");
        setLoading(false);
      });
  }, [id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>❌ {error}</p>;
  if (!session) return <p>Session non trouvée</p>;

  const profit = session.cash_out - session.buy_in;

  return (
    <div className="sessions-container">
      <div className="sessions-header">
        <div>
          <h1 className="sessions-title">Détail de la session</h1>
          <p className="sessions-subtitle">Analyse complète de cette partie.</p>
        </div>

        <button className="btn-add-session" onClick={() => navigate(-1)}>
          ← Retour
        </button>
      </div>

      <div className="session-card">
        {/* Header */}
        <div className="session-card-header">
          <div className="session-date">📅 {formatDate(session.date)}</div>

          <div className={`session-profit ${profit >= 0 ? "profit" : "loss"}`}>
            {profit >= 0 ? "+" : ""}
            {profit.toFixed(2)}€
          </div>
        </div>

        {/* Body */}
        <div className="session-card-body">
          <div className="session-info-row">
            <div className="info-item">
              <span className="info-label">Buy-in</span>
              <span className="info-value">{session.buy_in}€</span>
            </div>

            <div className="info-item">
              <span className="info-label">Cash-out</span>
              <span className="info-value">{session.cash_out}€</span>
            </div>
          </div>

          <div className="session-info-row">
            <div className="info-item">
              <span className="info-label">Salle</span>
              <span className="info-value">{session.room}</span>
            </div>

            <div className="info-item">
              <span className="info-label">Type</span>
              <span className="info-value">{session.game_type}</span>
            </div>
          </div>

          <div className="session-info-row">
            <div className="info-item">
              <span className="info-label">Durée</span>
              <span className="info-value">{session.duration} min</span>
            </div>

            <div className="info-item">
              <span className="info-label">Technique</span>
              <span className="info-value">{session.technical_rating}/10</span>
            </div>

            <div className="info-item">
              <span className="info-label">Mental</span>
              <span className="info-value">{session.mental_rating}/10</span>
            </div>
          </div>

          {/* Notes */}
          {session.notes && (
            <div className="session-notes">
              <p>📝 {session.notes}</p>
            </div>
          )}

          {/* Tags */}
          {session.tags && session.tags.length > 0 && (
            <div className="session-tags">
              {session.tags.map((tag) => (
                <span key={tag.id} className="tag">
                  {tag.name}
                </span>
              ))}
            </div>
          )}
          <div
            className="session-actions"
            style={{ marginTop: "1.5rem", display: "flex", gap: "1rem" }}
          >
            <button
              className="btn-add-session"
              onClick={() => navigate(`/sessions/edit/${session.id}`)}
              style={{ flex: 1 }}
            >
              ✏️ Modifier
            </button>

            <button
              className="btn-delete-session"
              onClick={() => {
                if (
                  window.confirm(
                    "⚠️ Voulez-vous vraiment supprimer cette session ?",
                  )
                ) {
                  fetchWithAuth(`/sessions/${session.id}`, { method: "DELETE" })
                    .then((res) => {
                      if (!res.ok)
                        throw new Error("Erreur lors de la suppression");
                      navigate("/sessions");
                    })
                    .catch((err) => {
                      alert(err.message);
                    });
                }
              }}
              style={{ flex: 1 }}
            >
              🗑 Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SessionDetails;
