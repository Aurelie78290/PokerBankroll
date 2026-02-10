import Login from "../components/Login";

import "./Home.css";

function Home() {
  return (
    <section className="home-section">
      <div className="home-hero">
        <h1 className="home-hero-title">PokerBankroll</h1>
        <p>
          Suivez vos sessions de jeu. Analysez vos performances. Gérez votre
          bankroll comme un professionnel du poker.
        </p>
      </div>
      <Login />
    </section>
  );
}

export default Home;
