import { useState } from "react";
import { useNavigate } from "react-router";
import { login } from "../services/api";
import { useAuth } from "../context/AuthContext";

function Register() {
  const navigate = useNavigate();
  const { setUser, setAuthToken } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    initial_bankroll: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    if (formData.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    setLoading(true);

    try {
      // 1. Créer le compte
      const registerResponse = await fetch("http://localhost:4242/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          initial_bankroll: formData.initial_bankroll
            ? Number(formData.initial_bankroll)
            : 0,
        }),
      });

      if (!registerResponse.ok) {
        const errorData = await registerResponse.json();
        throw new Error(errorData.error || "Erreur lors de l'inscription");
      }

      // 2. Se connecter automatiquement
      const loginData = await login(formData.email, formData.password);
      setUser(loginData.user);
      setAuthToken(loginData.token);

      // 3. Rediriger vers le dashboard
      navigate("/dashboard");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors de l'inscription",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="login-section">
      <p>Créez votre compte</p>
      <form onSubmit={handleSubmit} className="login-form">
        {error && <div className="login-error">{error}</div>}

        <div>
          <label>Nom d'utilisateur : </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="JaneDoe"
            required
            minLength={3}
          />
        </div>

        <div>
          <label>Email : </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="jane@exemple.com"
            required
          />
        </div>

        <div>
          <label>Mot de passe : </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="minimum 6 caractères"
            required
            minLength={6}
          />
        </div>

        <div>
          <label>Confirmer le mot de passe : </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="..."
            required
          />
        </div>

        <div>
          <label>Bankroll initiale (€) : </label>
          <input
            type="number"
            name="initial_bankroll"
            value={formData.initial_bankroll}
            onChange={handleChange}
            placeholder="1000 (optionnel)"
            step="0.01"
            min="0"
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Inscription..." : "Créer mon compte"}
        </button>
      </form>
    </section>
  );
}

export default Register;
