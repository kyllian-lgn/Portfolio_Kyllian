import React from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { PortfolioProvider } from "./context/PortfolioContext";
import CustomCursor from "./components/CustomCursor";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Parcours from "./pages/Parcours";
import Experiences from "./pages/Experiences";
import Skills from "./pages/Skills";
import Passions from "./pages/Passions";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";

function PublicShell() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projets" element={<Projects />} />
        <Route path="/projets/:id" element={<ProjectDetail />} />
        <Route path="/parcours" element={<Parcours />} />
        <Route path="/experiences" element={<Experiences />} />
        <Route path="/competences" element={<Skills />} />
        <Route path="/passions" element={<Passions />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Layout>
  );
}

function AppShell() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  return (
    <>
      <CustomCursor />
      {isAdmin ? (
        <Routes>
          <Route path="/admin" element={<Admin />} />
        </Routes>
      ) : (
        <PublicShell />
      )}
    </>
  );
}

function App() {
  return (
    <PortfolioProvider>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </PortfolioProvider>
  );
}

export default App;
