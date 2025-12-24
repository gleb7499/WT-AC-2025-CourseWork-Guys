import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import RequestsPage from "./pages/RequestsPage";
import CreateRequestPage from "./pages/CreateRequestPage";
import RequestDetailPage from "./pages/RequestDetailPage";
import VolunteerProfilePage from "./pages/VolunteerProfilePage";
import AssignmentsPage from "./pages/AssignmentsPage";

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div style={{ padding: 24 }}>Загрузка...</div>;
  return user ? children : <Navigate to="/login" />;
}

function Layout({ children }: { children: JSX.Element }) {
  const { user, logout } = useAuth();

  return (
    <div>
      <nav style={{ padding: 16, borderBottom: "1px solid #ccc", display: "flex", gap: 16, alignItems: "center" }}>
        <Link to="/" style={{ fontWeight: "bold" }}>Помощь рядом</Link>
        {user && (
          <>
            <Link to="/">Запросы</Link>
            <Link to="/volunteer">Профиль волонтёра</Link>
            <Link to="/assignments">Назначения</Link>
            <span style={{ marginLeft: "auto" }}>{user.username}</span>
            <button onClick={logout} style={{ padding: "4px 12px" }}>Выйти</button>
          </>
        )}
      </nav>
      {children}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/" element={<ProtectedRoute><RequestsPage /></ProtectedRoute>} />
            <Route path="/requests/new" element={<ProtectedRoute><CreateRequestPage /></ProtectedRoute>} />
            <Route path="/requests/:id" element={<ProtectedRoute><RequestDetailPage /></ProtectedRoute>} />
            <Route path="/volunteer" element={<ProtectedRoute><VolunteerProfilePage /></ProtectedRoute>} />
            <Route path="/assignments" element={<ProtectedRoute><AssignmentsPage /></ProtectedRoute>} />
          </Routes>
        </Layout>
      </AuthProvider>
    </BrowserRouter>
  );
}
