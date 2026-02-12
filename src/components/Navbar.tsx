import { NavLink, useNavigate } from "react-router";
import { logout } from "../services/api.ts";
import { useAuth } from "../context/AuthContext.tsx";

import logo from "../assets/images/logoCPKAcademy.png";

import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="header-container">
      <NavLink to="/">
        <img src={logo} className="navbar-logo" alt="CPK Academy" />
      </NavLink>
      {!user ? null : (
        <>
          <p className="header-navbar-bienvenue">
            {user && <span>Bienvenue, {user.username}.</span>}
          </p>
          <nav className="header-navbar">
            <ul className="header-navbar-list">
              <li>
                <NavLink to="/dashboard">Mon Dashboard</NavLink>
              </li>
              <li>
                <NavLink to="/sessions">Mes Sessions</NavLink>
              </li>
              <li>
                <NavLink to="/settings">Mon Profil</NavLink>
              </li>

              <li>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="navbar-deconnected"
                >
                  Déconnexion
                </button>
              </li>
            </ul>
          </nav>
        </>
      )}
    </header>
  );
}

export default Navbar;
