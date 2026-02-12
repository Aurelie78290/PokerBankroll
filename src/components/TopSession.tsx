import "./TopSession.css";

type Session = {
  id: number;
  date: string;
  buy_in: number;
  cash_out: number;
};

type TopSessionsProps = {
  sessions: Session[];
};

function TopSessions({ sessions }: TopSessionsProps) {
  if (sessions.length === 0) {
    return null;
  }

  const sessionsWithProfit = sessions.map((s) => {
    const buyIn = Number(s.buy_in) || 0;
    const cashOut = Number(s.cash_out) || 0;

    return {
      ...s,
      profit: cashOut - buyIn,
    };
  });

  const sortedByProfit = [...sessionsWithProfit].sort(
    (a, b) => b.profit - a.profit,
  );
  const bestSession = sortedByProfit[0];
  const worstSession = sortedByProfit[sortedByProfit.length - 1];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="top-sessions">
      <div className="top-sessions-grid">
        {/* Meilleure session */}
        <div className="top-session-card best">
          <div className="top-session-icon"></div>
          <h3>Meilleure Session</h3>
          <p className="top-session-date">{formatDate(bestSession.date)}</p>
          <p className="top-session-profit profit">
            +{bestSession.profit.toFixed(2)}€
          </p>
          <p className="top-session-details">
            {bestSession.buy_in}€ → {bestSession.cash_out}€
          </p>
        </div>

        {/* Pire session */}
        <div className="top-session-card worst">
          <div className="top-session-icon"></div>
          <h3>Pire Session</h3>
          <p className="top-session-date">{formatDate(worstSession.date)}</p>
          <p className="top-session-profit loss">
            {worstSession.profit.toFixed(2)}€
          </p>
          <p className="top-session-details">
            {worstSession.buy_in}€ → {worstSession.cash_out}€
          </p>
        </div>
      </div>
    </div>
  );
}

export default TopSessions;
