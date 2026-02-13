import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import { AuthProvider } from "./context/AuthContext.tsx";
import ProtectedRoutes from "./components/ProtectedRoutes.tsx";

import App from "./App.tsx";
import Home from "./pages/Home.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Register from "./pages/Register.tsx";
import Sessions from "./pages/Sessions.tsx";
import SessionDetails from "./pages/SessionDetails.tsx";
import Settings from "./pages/Settings.tsx";

import "./index.css";

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/dashboard",
        element: (
          <ProtectedRoutes>
            <Dashboard />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/sessions",
        element: (
          <ProtectedRoutes>
            <Sessions />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/sessions/:id",
        element: (
          <ProtectedRoutes>
            <SessionDetails />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/settings",
        element: (
          <ProtectedRoutes>
            <Settings />
          </ProtectedRoutes>
        ),
      },
    ],
  },
]);

const rootElement = document.getElementById("root");

if (rootElement != null) {
  createRoot(rootElement).render(
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>,
  );
}
