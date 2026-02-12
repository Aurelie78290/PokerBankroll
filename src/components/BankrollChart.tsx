import { Line } from "react-chartjs-2";
import { useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import "./BankrollChart.css";

// Enregistrer les composants Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

type Session = {
  date: string;
  profit?: number;
  buy_in: number;
  cash_out: number;
};

type BankrollChartProps = {
  sessions: Session[];
  initialBankroll: number;
};

function BankrollChart({ sessions, initialBankroll }: BankrollChartProps) {
  // Calculer l'évolution de la bankroll
  const { labels, bankrollData } = useMemo(() => {
    if (
      !sessions ||
      sessions.length === 0 ||
      initialBankroll === undefined ||
      initialBankroll === null
    ) {
      return { labels: [], bankrollData: [] };
    }

    const startBankroll = Number(initialBankroll);
    if (isNaN(startBankroll)) {
      return { labels: [], bankrollData: [] };
    }

    const sortedSessions = [...sessions].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    let currentBankroll = startBankroll;

    const labels = ["Départ"];
    const bankrollData = [currentBankroll]; // ✅ même valeur sécurisée

    sortedSessions.forEach((session) => {
      const buyIn = Number(session.buy_in) || 0;
      const cashOut = Number(session.cash_out) || 0;
      const profit = cashOut - buyIn;

      currentBankroll += profit;

      labels.push(
        new Date(session.date).toLocaleDateString("fr-FR", {
          day: "2-digit",
          month: "short",
        }),
      );

      bankrollData.push(currentBankroll);
    });

    return { labels, bankrollData };
  }, [sessions, initialBankroll]);

  if (!bankrollData.length) {
    return (
      <div className="chart-container">
        <div className="chart-empty">
          <p>📊 Données en cours de chargement</p>
          <p className="chart-empty-hint">
            Ajoutez des sessions pour voir l'évolution
          </p>
        </div>
      </div>
    );
  }

  // Configuration du graphique
  const data = {
    labels,
    datasets: [
      {
        label: "Bankroll (€)",
        data: bankrollData,
        borderColor: "#10b981",
        backgroundColor: (context: any) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(0, "rgba(16, 185, 129, 0.3)");
          gradient.addColorStop(1, "rgba(16, 185, 129, 0.0)");
          return gradient;
        },
        borderWidth: 3,
        fill: true,
        tension: 0.4, // Courbe lisse
        pointRadius: 5,
        pointBackgroundColor: "#10b981",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointHoverRadius: 7,
        pointHoverBackgroundColor: "#059669",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Évolution de la Bankroll",
        font: {
          size: 18,
          weight: "bold" as const,
        },
        color: "#1f2937",
        padding: {
          top: 10,
          bottom: 20,
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        padding: 12,
        borderColor: "#10b981",
        borderWidth: 1,
        displayColors: false,
        callbacks: {
          label: function (context: any) {
            return `Bankroll: ${context.parsed.y.toFixed(2)}€`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          callback: function (value: any) {
            return value + "€";
          },
          color: "#6b7280",
          font: {
            size: 12,
          },
        },
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
      },
      x: {
        ticks: {
          color: "#6b7280",
          font: {
            size: 11,
          },
          maxRotation: 45,
          minRotation: 45,
        },
        grid: {
          display: false,
        },
      },
    },
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
  };

  return (
    <div className="chart-container">
      <div className="chart-wrapper">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}

export default BankrollChart;
