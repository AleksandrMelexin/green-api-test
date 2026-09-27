import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "@/pages/main-page";
import Error404Page from "@/pages/error404-page";
import AuthPage from "@/pages/auth-page";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="*" element={<Error404Page />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;