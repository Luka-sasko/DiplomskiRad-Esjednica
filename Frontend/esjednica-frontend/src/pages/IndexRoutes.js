import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "../components/common/Navbar";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import HomePage from "./HomePage";
import SjednicePage from "./SjednicaPage";
import SjednicaDetailPage from "./SjednicaDetailPage";
import TockaPage from "./TockaPage";
import { ProfilePage } from "./ProfilePage";
import UsersTable from "../components/Profile/UserTable";

const IndexRoutes = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/tablica-korisnika" element={<UsersTable />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/racun" element={<ProfilePage />} />
        <Route path="/prijava" element={<LoginPage />} />
        <Route path="/registracija" element={<RegisterPage />} />
        <Route path="/sjednice" element={<SjednicePage />} />
        <Route path="/sjednice/:id" element={<SjednicaDetailPage />} />
        <Route path="/sjednice/:sjednicaId/tocke/:id" element={<TockaPage />} />
      </Routes>
    </Router>
  );
};

export default IndexRoutes;
