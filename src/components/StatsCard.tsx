import "./StatsCard.css";

type StatsCardProps = {
  currentBankroll: number | string | null | undefined;
  totalProfit: number;
  totalSessions: number;
  winRate: number;
};

function StatsCard({
  currentBankroll,
  totalProfit,
  totalSessions,
  winRate,
}: StatsCardProps) {
  const bankrollNumber = Number(currentBankroll);

  return (
    <section className="statsCard-grid">
      <div className="statsCard-card">
        <div className="statsCard-content">
          <p className="stats-label">Bankroll actuelle</p>
          <p className="stats-value">
            {!isNaN(bankrollNumber) ? bankrollNumber.toFixed(2) : "0.00"}€
          </p>
        </div>
      </div>

      <div className="statsCard-card">
        <div className="stat-icon profit">{totalProfit >= 0 ? "📈" : "📉"}</div>
        <div className="statsCard-content">
          <p className="stats-label">Profit Total</p>
          <p className={`stat-value ${totalProfit >= 0 ? "profit" : "loss"}`}>
            {totalProfit >= 0 ? "+" : ""}
            {totalProfit.toFixed(2)}€
          </p>
        </div>
      </div>

      <div className="statsCard-card">
        <div className="statsCard-content">
          <p className="stats-label">Sessions Jouées</p>
          <p className="stats-value">{totalSessions}</p>
        </div>
      </div>

      <div className="statsCard-card">
        <div className="statsCard-content">
          <p className="stats-label">Win Rate</p>
          <p className="stats-value">{winRate}%</p>
        </div>
      </div>
    </section>
  );
}

export default StatsCard;
