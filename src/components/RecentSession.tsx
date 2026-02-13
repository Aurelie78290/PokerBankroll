import { Link } from "react-router";

import "./RecentSession.css";

type Session = {
  id: number;
  date: string;
  buy_in: number;
  cash_out: number;
  room: string;
  profit: number;
  notes: string;
};

type RecentSessionsProps = {
  sessions: Session[];
};

function RecentSessions({ sessions }: RecentSessionsProps) {
  return (
    <div className="recent-sessions">
      <div className="recent-sessions-header">
        <h2>Sessions Récentes</h2>
        <Link to="/sessions" className="view-all-link">
          Voir tout →
        </Link>
      </div>

      {sessions.length === 0 ? (
        <div className="recent-sessions-empty">
          <p>Aucune session enregistrée</p>
          <Link to="/sessions" className="btn-add-first">
            Ajouter votre première session
          </Link>
        </div>
      ) : (
        <div className="recent-sessions-list">
          {sessions.slice(0, 2).map((session) => (
            <Link
              key={session.id}
              to={`/sessions/${session.id}`}
              className="recent-session-item"
            >
              <div className="session-date-icon">
                <span className="date-day">
                  {new Date(session.date).getDate()}
                </span>
                <span className="date-month">
                  {new Date(session.date).toLocaleDateString("fr-FR", {
                    month: "short",
                  })}
                </span>
                <span className="date-year">
                  {new Date(session.date).getFullYear()}
                </span>
              </div>

              <div className="session-info">
                <p className="session-title">{session.room}</p>
                <p className="session-details">
                  {session.buy_in}€ → {session.cash_out}€
                </p>
              </div>

              <div
                className={`session-profit ${
                  session.cash_out - session.buy_in >= 0 ? "profit" : "loss"
                }`}
              >
                {session.cash_out - session.buy_in >= 0 ? "+" : ""}
                {(session.cash_out - session.buy_in).toFixed(2)}€
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default RecentSessions;
