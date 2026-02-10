const API_URL = "http://localhost:4242/api";

// Récupérer le token stocké
export const getToken = (): string | null => {
  return localStorage.getItem("token");
};

// Stocker le token
export const setToken = (token: string): void => {
  localStorage.setItem("token", token);
};

// Supprimer le token
export const removeToken = (): void => {
  localStorage.removeItem("token");
};

// Login
export const login = async (email: string, password: string) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error("Email ou mot de passe incorrect");
  }

  const data = await response.json();
  setToken(data.token);
  return data;
};

// Logout
export const logout = (): void => {
  removeToken();
  window.location.href = "/";
};

// Vérifier si l'utilisateur est connecté
export const isAuthenticated = (): boolean => {
  return getToken() !== null;
};

// Headers avec authentification
export const getAuthHeaders = () => {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Fetch avec authentification
export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  });

  if (response.status === 401) {
    logout();
    throw new Error("Session expirée");
  }

  return response;
};
