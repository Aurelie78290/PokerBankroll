import { useEffect, useState } from "react";
import { fetchWithAuth } from "../services/api";
import { Link } from "react-router";
import AddSession from "../components/AddSession";
import pokerTable from "../assets/images/poker-table.png";
import pokerProfit from "../assets/images/poker-profit.png";
import pokerWin from "../assets/images/pokerWin.png";
import pokerStart from "../assets/images/poker-start.png";

import "./Sessions.css";

type Session = {
  id: number;
  user_id: number;
  username: string;
  date: string;
  buy_in: number;
  cash_out: number;
  profit: number;
  notes: string;
  tags: string | null;
};

type Tag = {
  id: number;
  name: string;
};

function Sessions() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  const loadSessions = () => {
    setLoading(true);
    Promise.all([
      fetchWithAuth("/sessions").then((res) => res.json()),
      fetchWithAuth("/tags").then((res) => res.json()),
    ])
      .then(([sessionsData, tagsData]) => {
        if (Array.isArray(sessionsData)) {
          setSessions(sessionsData);
        }
        if (Array.isArray(tagsData)) {
          setTags(tagsData);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Erreur lors du chargement");
        setLoading(false);
      });
  };

  useEffect(() => {
    loadSessions();
  }, []);

  // Stats calculées
  const totalSessions = sessions.length;
  const totalProfit = sessions.reduce(
    (sum, s) => sum + (s.cash_out - s.buy_in),
    0,
  );
  const winRate =
    totalSessions > 0
      ? (
          (sessions.filter((s) => s.cash_out - s.buy_in > 0).length /
            totalSessions) *
          100
        ).toFixed(0)
      : 0;

  // Formater la date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  // Parser les tags
  const parseTags = (tagsString: string | null) => {
    if (!tagsString) return [];
    return tagsString.split(",").map((tag) => tag.trim());
  };

  if (loading) {
    return (
      <div className="sessions-container">
        <div className="sessions-loading">
          <div className="spinner"></div>
          <p>Chargement des sessions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="sessions-container">
        <div className="sessions-error">
          <p>❌ {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="sessions-container">
      {/* Header avec titre et bouton */}
      <div className="sessions-header">
        <div>
          <h1 className="sessions-title">Mes Sessions</h1>
          <p className="sessions-subtitle">
            Historique de mes parties de cash game.
          </p>
        </div>
        <button className="btn-add-session" onClick={() => setShowAdd(true)}>
          ➕ Nouvelle session
        </button>
      </div>

      {/* Stats rapides */}
      <div className="sessions-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <img src={pokerTable} alt="cartes de poker" />
          </div>
          <div className="stat-content">
            <p className="stat-label">Sessions</p>
            <p className="stat-value">{totalSessions}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <img src={pokerProfit} alt="cartes de poker" />
          </div>
          <div className="stat-content">
            <p className="stat-label">Profit total</p>
            <p className={`stat-value ${totalProfit >= 0 ? "profit" : "loss"}`}>
              {totalProfit >= 0 ? "+" : ""}
              {totalProfit.toFixed(2)}€
            </p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <img src={pokerWin} alt="cartes de poker" />
          </div>
          <div className="stat-content">
            <p className="stat-label">Win rate</p>
            <p className="stat-value">{winRate}%</p>
          </div>
        </div>
      </div>

      {/* Liste des sessions */}
      {sessions.length === 0 ? (
        <div className="sessions-empty">
          <div className="empty-icon">
            <img src={pokerStart} alt="cartes de poker" />
          </div>
          <h2>Aucune session enregistrée</h2>
          <p>Commencez par ajouter votre première session de poker !</p>
          <button className="btn-add-session" onClick={() => setShowAdd(true)}>
            ➕ Ajouter une session
          </button>
        </div>
      ) : (
        <div className="sessions-grid">
          {sessions.map((session) => (
            <div key={session.id} className="session-card">
              {/* Header de la carte */}
              <div className="session-card-header">
                <div className="session-date">
                  📅 {formatDate(session.date)}
                </div>
                <div
                  className={`session-profit ${session.cash_out - session.buy_in >= 0 ? "profit" : "loss"}`}
                >
                  {session.cash_out - session.buy_in >= 0 ? "+" : ""}
                  {(session.cash_out - session.buy_in).toFixed(2)}€
                </div>
              </div>

              {/* Body de la carte */}
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

                <div className="session-conclusion">
                  {session.notes && (
                    <div className="session-notes">
                      <p>🤑 {session.notes}</p>
                    </div>
                  )}

                  {session.tags && (
                    <div className="session-tags">
                      {parseTags(session.tags).map((tag, index) => (
                        <span key={index} className="tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Footer de la carte */}
                  <div className="session-card-footer">
                    <Link
                      to={`/sessions/${session.id}`}
                      className="btn-details"
                    >
                      Voir détails →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAdd && (
        <AddSession
          onClose={() => setShowAdd(false)}
          onSessionAdded={loadSessions}
          tags={tags}
        />
      )}
    </div>
  );
}

export default Sessions;
