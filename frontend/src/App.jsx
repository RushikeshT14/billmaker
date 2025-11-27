import { useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage.jsx";
import Dashboard from "./components/Dashboard.jsx";
import AddProduct from "./components/AddProduct.jsx";
import EditProduct from "./components/EditProduct.jsx";
import Billing from "./components/Billing.jsx";
import BillHistory from "./components/BillHistory.jsx";
import ProductList from "./components/AllProducts.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<ProductList/>} />
          <Route path="billing" element={<Billing />} />
          <Route path="allproduct" element={<ProductList />} />
          <Route path="billhistory" element={<BillHistory />} />
          <Route path="addproduct" element={<AddProduct />} />
          <Route path="editproduct/:id" element={<EditProduct />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
