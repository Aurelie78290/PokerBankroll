import { useState } from "react";
import { useNavigate } from "react-router";
import { login } from "../services/api";
import { useAuth } from "../context/AuthContext";

import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const { setUser, setAuthToken } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await login(email, password);
      setUser(data.user);
      setAuthToken(data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="login-section">
      <p>Entrez vos identifiants</p>
      <form onSubmit={handleSubmit} className="login-form">
        {error && <div>{error}</div>}

        <div>
          <label>Email : </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="aurelie@email.com"
            required
          />
        </div>

        <div>
          <label>Mot de passe : </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="..."
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Connexion..." : "Connexion"}
        </button>
      </form>
    </section>
  );
}

export default Login;
