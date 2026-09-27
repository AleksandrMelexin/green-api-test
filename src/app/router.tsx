import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import MainPage from "@/pages/main-page";
import AuthPage from "@/pages/auth-page";
import { useAuth } from "@/entities/session/model";

const PrivateRoute = () => {
  const creds = useAuth((s) => s.creds);
  return creds ? <Outlet /> : <Navigate to="/" replace />;
};

const GuestRoute = () => {
  const creds = useAuth((s) => s.creds);
  return creds ? <Navigate to="/chats" replace /> : <Outlet />;
};

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<GuestRoute />}>
          <Route path="/" element={<AuthPage />} />
        </Route>
        <Route element={<PrivateRoute />}>
          <Route path="/chats" element={<MainPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;