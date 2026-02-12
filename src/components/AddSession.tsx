import { useState } from "react";
import { fetchWithAuth } from "../services/api";

import "./AddSession.css";

type Tag = {
  id: number;
  name: string;
};

type AddSessionProps = {
  onClose: () => void;
  onSessionAdded: () => void;
  tags: Tag[];
};

function AddSession({ onClose, onSessionAdded, tags }: AddSessionProps) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0], // Date du jour par défaut
    room: "",
    buy_in: "",
    cash_out: "",
    duration: "",
    game_type: "",
    technical_rating: "",
    mental_rating: "",
    notes: "",
  });
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Calculer le profit en temps réel
  const profit =
    formData.buy_in && formData.cash_out
      ? Number(formData.cash_out) - Number(formData.buy_in)
      : 0;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const toggleTag = (tagId: number) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const payload = {
      date: formData.date,
      room: formData.room,
      buy_in: Number(formData.buy_in),
      cash_out: Number(formData.cash_out),
      duration: Number(formData.duration),
      game_type: formData.game_type,
      technical_rating: Number(formData.technical_rating),
      mental_rating: Number(formData.mental_rating),
      notes: formData.notes,
      tag_ids: selectedTags,
    };

    console.log("📤 Payload envoyé:", payload);

    try {
      const response = await fetchWithAuth("/sessions", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      console.log("📥 Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("❌ Erreur backend:", errorData); // ⚠️ DEBUG
        throw new Error(
          errorData.error || "Erreur lors de l'ajout de la session",
        );
      }

      onSessionAdded(); // Rafraîchir la liste
      onClose(); // Fermer le modal
    } catch (err) {
      console.error("❌ Erreur:", err);
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Nouvelle Session</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="session-form">
          {error && <div className="form-error">{error}</div>}

          {/* Date */}
          <div className="form-group">
            <label htmlFor="date">📅 Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          {/* Room */}
          <div className="form-group">
            <label htmlFor="room">Salle de jeu</label>
            <input
              type="text"
              id="room"
              name="room"
              value={formData.room}
              onChange={handleChange}
              placeholder="Winamax, PMU, Casino Live..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="game_type">Type de partie</label>
            <select
              id="game_type"
              name="game_type"
              value={formData.game_type}
              onChange={handleChange}
              required
            >
              <option value="">-- Choisir --</option>
              <option value="Cash Game">Cash Game</option>
              <option value="Tournoi">Tournoi</option>
              <option value="Sit & Go">Sit & Go</option>
              <option value="Online">Online</option>
              <option value="Live">Live</option>
            </select>
          </div>

          {/* Buy-in et Cash-out */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="buy_in">Buy-in (€)</label>
              <input
                type="number"
                id="buy_in"
                name="buy_in"
                value={formData.buy_in}
                onChange={handleChange}
                placeholder="0"
                step="0.01"
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="cash_out">Cash-out (€)</label>
              <input
                type="number"
                id="cash_out"
                name="cash_out"
                value={formData.cash_out}
                onChange={handleChange}
                placeholder="0"
                step="0.01"
                min="0"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="duration">Durée (minutes)</label>
            <input
              type="number"
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="120"
              min="0"
              required
            />
          </div>

          {/* Affichage du profit calculé */}
          {formData.buy_in && formData.cash_out && (
            <div
              className={`profit-display ${profit >= 0 ? "profit" : "loss"}`}
            >
              <span className="profit-label">Résultat :</span>
              <span className="profit-value">
                {profit >= 0 ? "+" : ""}
                {profit.toFixed(2)}€
              </span>
            </div>
          )}

          {/* Notes techniques et mentales */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="technical_rating">Note technique (1-10)</label>
              <input
                type="number"
                id="technical_rating"
                name="technical_rating"
                value={formData.technical_rating}
                onChange={handleChange}
                placeholder="8"
                min="1"
                max="10"
              />
            </div>

            <div className="form-group">
              <label htmlFor="mental_rating">Note mentale (1-10)</label>
              <input
                type="number"
                id="mental_rating"
                name="mental_rating"
                value={formData.mental_rating}
                onChange={handleChange}
                placeholder="9"
                min="1"
                max="10"
              />
            </div>
          </div>

          {/* Tags */}
          <div className="form-group">
            <label>Tags</label>
            <div className="tags-selection">
              {tags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  className={`tag-button ${
                    selectedTags.includes(tag.id) ? "active" : ""
                  }`}
                  onClick={() => toggleTag(tag.id)}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="form-group">
            <label htmlFor="notes">Notes (optionnel)</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Comment s'est passée cette session ?"
              rows={4}
            />
          </div>

          {/* Boutons */}
          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
              disabled={loading}
            >
              Annuler
            </button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddSession;
