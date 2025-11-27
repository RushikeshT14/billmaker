import React, { useEffect, useState } from "react";
// import "../CSS/AllProducts.css";
import "../CSS/Billing.css";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
const API = import.meta.env.VITE_API_URL;

function Billing() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [billItems, setBillItems] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [finalBill, setFinalBill] = useState(null);

  const onSubmit = async (data) => {
    const convertedItems = billItems.map((item) => ({
      productId: item._id,
      productName: item.productName,
      quantity: item.quantity,
      sellingPrice: item.sellingPrice,
      total: item.quantity * item.sellingPrice,
    }));

    const totalAmount = convertedItems.reduce((sum, p) => sum + p.total, 0);

    const bill = {
      clientName: data.clientName,
      address: data.address,
      contactNo: data.phoneNo,
      date: data.date,
      items: convertedItems,
      totalAmount,
    };

    setFinalBill(bill);
    setShowPopup(true); 
  };
  const saveBillToDB = async () => {
    try {
      const res = await fetch(`${API}/bill`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalBill),
      });
      const result = await res.json();
      window.print();
      setShowPopup(false);
    } catch (err) {
      console.log("Error saving bill:", err);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          `${API}/products?search=${search}`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await res.json();

        if (!data.success) {
          console.log("Unauthorized");
          return;
        }

        setProducts(data.products || []);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchProducts();
  }, [search]);

  const addBtnClickHandle = (item) => {
    setBillItems((prev) => {
      const updatedBill = [...prev];
      let found = false;
      for (let i = 0; i < updatedBill.length; i++) {
        if (updatedBill[i]._id === item._id) {
          updatedBill[i].quantity += 1;
          found = true;
          break;
        }
      }
      if (!found) {
        updatedBill.push({ ...item, quantity: 1 });
      }
      return updatedBill;
    });
  };

  const removeBtnClickHandle = (item) => {
    setBillItems((prev) => prev.filter((p) => p._id !== item._id));
  };
  const updateQuantity = (id, qty) => {
    setBillItems((prev) =>
      prev.map((item) => (item._id === id ? { ...item, quantity: qty } : item))
    );
  };
  const closePopup = () => {
    setShowPopup(false);
  };
  return (
    <div className="all-bill-products-container">
      {showPopup && finalBill && (
        <div className="invoice-popup">
          <div className="invoice-box">
            <div className="invoice-header">
              <div className="shop-info">
                <h2>YOUR SHOP NAME</h2>
                <p>Shop Address Line 1</p>
                <p>Contact: 9876543210</p>
              </div>
              <div className="invoice-meta">
                <p>
                  <strong>Invoice No:</strong> ___________________
                </p>
                <p>
                  <strong>Date:</strong> {finalBill.date}
                </p>
              </div>
            </div>
            <hr />
            <div className="invoice-customer">
              <h3>Customer Details</h3>
              <p>
                <strong>Name:</strong> {finalBill.clientName}
              </p>
              <p>
                <strong>Address:</strong> {finalBill.address}
              </p>
              <p>
                <strong>Phone:</strong> {finalBill.contactNo}
              </p>
            </div>
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
                {billItems.map((item, idx) => (
                  <tr key={item._id}>
                    <td>{idx + 1}</td>
                    <td>{item.productName}</td>
                    <td>{item.quantity}</td>
                    <td>{item.sellingPrice}</td>
                    <td>{item.quantity * item.sellingPrice}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="invoice-total">
              <p>
                <strong>Total Amount:</strong> ₹{finalBill.totalAmount}
              </p>
            </div>

            <div className="invoice-footer">
              <p>Thank you for shopping with us!</p>
            </div>

            <div className="invoice-btns">
              <button onClick={saveBillToDB}>Print</button>
              <button onClick={closePopup}>Close</button>
            </div>
          </div>
        </div>
      )}

      <label className="search-wrapper">
        <input
          type="text"
          placeholder="Search Items"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </label>
      <div className="bill-con">
        <form onSubmit={handleSubmit(onSubmit)} className="bill-form" autoComplete="off">
          <input
            className="clientName"
            type="text"
            placeholder="Client Name"
            {...register("clientName", { required: "Client name required" })}
          />{" "}
          <br />
          {errors.clientName && (
            <span className="error">This field is required</span>
          )}
          <input
            className="address"
            type="text"
            placeholder="Address"
            {...register("address", { required: "address required" })}
          />{" "}
          <br />
          {errors.address && (
            <span className="error">This field is required</span>
          )}
          <input
            className="phoneno"
            type="tel"
            placeholder="Contact Number"
            {...register("phoneNo", {
              required: "Phone number is required",
              minLength: {
                value: 10,
                message: "Phone number must be 10 digits",
              },
              maxLength: {
                value: 10,
                message: "Phone number must be 10 digits",
              },
            })}
          />
          {errors.phoneNo && (
            <span className="error">{errors.phoneNo.message}</span>
          )}
          <input
            className="date"
            defaultValue={new Date().toISOString().slice(0, 10)}
            {...register("date")}
          />
          <br />
          <button className="create-bill" type="submit">
            Preview Bill
          </button>
        </form>
        {billItems.length > 0 && (
          <table className="products-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {billItems.map((p) => (
                <tr key={p._id}>
                  <td className="productname">{p.productName}</td>
                  <td>{p.sellingPrice}</td>
                  <td>
                    <input
                      className="qty-input"
                      type="number"
                      min="1"
                      value={p.quantity}
                      onChange={(e) =>
                        updateQuantity(p._id, Number(e.target.value))
                      }
                    />
                  </td>
                  <td>{p.sellingPrice * p.quantity}</td>
                  <td>
                    <button
                      onClick={() => removeBtnClickHandle(p)}
                      className="remove-btn"
                    >
                      Remove <i className="fa-solid fa-minus"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : products.length > 0 ? (
        <table className="products-table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Category</th>
              <th>MRP</th>
              <th>Selling Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id}>
                <td className="productname">{p.productName}</td>
                <td className="productname">{p.category}</td>
                <td>{p.MRP}</td>
                <td>{p.sellingPrice}</td>
                <td>
                  <button
                    onClick={() => addBtnClickHandle(p)}
                    className="add-btn"
                  >
                    Add <i className="fa-solid fa-plus"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={{ color: "red" }}>Product not Found</p>
      )}
    </div>
  );
}

export default Billing;
