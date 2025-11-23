import { useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage.jsx";
import Dashboard from "./components/Dashboard.jsx";
import AddProduct from "./components/AddProduct.jsx";
import EditProduct from "./components/EditProduct.jsx";
import Billing from "./components/Billing.jsx";
import BillHistory from "./components/BillHistory.jsx";
import DashboardRightSilde from "./components/DashboardRightSide.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<DashboardRightSilde/>} />
          <Route path="billing" element={<Billing />} />
          <Route path="billhistory" element={<BillHistory />} />
          <Route path="addproduct" element={<AddProduct />} />
          <Route path="editproduct" element={<EditProduct />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
