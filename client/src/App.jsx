import { Route, Routes } from "react-router-dom";
import OverviewPage from "./pages/OverviewPage";
import ProductsPage from "./pages/ProductsPage";
import Sidebar from "./components/Sidebar";
import UsersPage from "./pages/UsersPage";
import SalesPage from "./pages/SalesPage";
import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <div className="flex h-screen bg-blue-950 text-gray-100 overflow-hidden">
        {/* BG */}
        <div className="fixed inset-0 z-1">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-blue-900 to-blue-950 opacity-80" />
          <div className="absolute inset-0 backdrop-blur-sm" />
        </div>

        <Sidebar />
        <Routes>
          <Route path="/" element={<OverviewPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/management/members" element={<UsersPage />} />
          <Route path="/sales" element={<SalesPage />} />
        </Routes>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
}

export default App;
