import { useEffect, useState } from "react";
import { fetchWithAuth } from "../services/api";
import { useAuth } from "../context/AuthContext";
import StatsCard from "../components/StatsCard";

type Session = {
  id: number;
  user_id: number;
  date: string;
  buy_in: number;
  cash_out: number;
  profit: number;
  notes: string;
};

type User = {
  id: number;
  username: string;
  email: string;
  initial_bankroll: number;
};

function Dashboard() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [userDetails, setUserDetails] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchWithAuth("/sessions").then((res) => res.json()),
      user
        ? fetchWithAuth(`/users/${user.id}`).then((res) => res.json())
        : null,
    ])
      .then(([sessionsData, userData]) => {
        if (Array.isArray(sessionsData)) {
          setSessions(sessionsData);
        }
        if (userData) {
          setUserDetails(userData);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [user]);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Chargement du dashboard...</p>
      </div>
    );
  }

  const initialBankroll = userDetails?.initial_bankroll || 0;
  const totalProfit = sessions.reduce(
    (sum, s) => sum + (s.cash_out - s.buy_in),
    0,
  );
  const currentBankroll = initialBankroll + totalProfit;
  const totalSessions = sessions.length;
  const winRate =
    totalSessions > 0
      ? (
          (sessions.filter((s) => s.cash_out - s.buy_in > 0).length /
            totalSessions) *
          100
        ).toFixed(0)
      : 0;

  return (
    <>
      <h1>Dashboard</h1>
      <StatsCard
        currentBankroll={currentBankroll}
        totalProfit={totalProfit}
        totalSessions={totalSessions}
        winRate={Number(winRate)}
      />
    </>
  );
}

export default Dashboard;
