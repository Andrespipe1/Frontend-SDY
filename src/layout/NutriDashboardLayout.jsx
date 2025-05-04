// src/layout/UserDashboardLayout.jsx
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const NutriDashboardLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-4 bg-gray-50">
        <Outlet /> {/* Aquí se renderizan las subpáginas del dashboard */}
      </main>
      <Footer />
      
    </div>
  );
};

export default NutriDashboardLayout;
