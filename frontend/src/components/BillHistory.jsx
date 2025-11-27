import React, { useEffect, useState } from "react";
import "../CSS/BillHistory.css";
const API = import.meta.env.VITE_API_URL;
function BillHistory() {
  const [bills, setBills] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [viewBill, setViewBill] = useState(null);

  const fetchBills = async () => {
    try {
      const res = await fetch(`${API}/allbills?search=${search}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        }
      });

      const data = await res.json();
      if (data.success) {
        setBills(data.bills || []);
      }
      setLoading(false);
    } catch (error) {
      console.log("Error:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, [search]);

  const deleteBill = async (id) => {
    if (!window.confirm("Are you sure you want to delete this bill?")) return;

    try {
      const res = await fetch(`${API}/allbills/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        }
      });

      const data = await res.json();
      if (data.success) {
        // alert("Bill deleted");
        fetchBills(); 
      }
    } catch (error) {
      console.log("Delete Error:", error);
    }
  };

  return (
    <div className="bill-history-container">
      <h2 className="title">Bill History</h2>

     
      <input
        type="text"
        className="search-bill"
        placeholder="Search by customer name"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <p>Loading...</p>
      ) : bills.length === 0 ? (
        <p style={{ color: "red" }}>No Bills Found</p>
      ) : (
        <table className="products-table">
          <thead>
            <tr>
              <th>Invoice No</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Total Amount</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {bills.map((bill) => (
              <tr key={bill._id}>
                <td>{bill._id.slice(-6).toUpperCase()}</td>
                <td>{bill.clientName}</td>
                <td>{new Date(bill.date).toISOString().slice(0, 10)}</td>
                <td>₹{bill.totalAmount}</td>
                <td>
                  <button
                    className="view-btn"
                    onClick={() => setViewBill(bill)}
                  >
                    View
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => deleteBill(bill._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

  
      {viewBill && (
        <div className="invoice-popup">
          <div className="invoice-box">
            <h2>Your Shop Name</h2>
            <p>Invoice No: {viewBill._id.slice(-6).toUpperCase()}</p>
            <p>Date: {viewBill.date}</p>

            <hr />
            <h3>Customer Details</h3>
            <p><strong>Name:</strong> {viewBill.clientName}</p>
            <p><strong>Address:</strong> {viewBill.address}</p>
            <p><strong>Phone:</strong> {viewBill.contactNo}</p>
            <hr />

            <table className="invoice-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>

              <tbody>
                {viewBill.items.map((item, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{item.productName}</td>
                    <td>{item.quantity}</td>
                    <td>{item.sellingPrice}</td>
                    <td>{item.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="invoice-total">
              <strong>Total Amount: ₹{viewBill.totalAmount}</strong>
            </div>

            <button className="close-popup" onClick={() => setViewBill(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default BillHistory;
