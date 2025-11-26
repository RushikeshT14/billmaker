import React, { useEffect, useState } from "react";
// import "../CSS/AllProducts.css";
import "../CSS/Billing.css";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

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

  const onSubmit = (data) => {
    console.log(data.clientName);
    console.log(data.address);
    console.log(data.phoneNo);
    console.log(data.date);
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
          `http://localhost:3000/products?search=${search}`,
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
      console.log(updatedBill);
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

  return (
    <div className="all-bill-products-container">
      {/* <h2 className="bill-title title">Add Products to Bill</h2> */}
      <label className="search-wrapper">
        <input
          type="text"
          placeholder="Search Items"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </label>
      <div className="bill-con">
        <form onSubmit={handleSubmit(onSubmit)} className="bill-form">
          <input
            className="clientName"
            type="text"
            placeholder="Client Name"
            {...register("clientName", { required: "Client name required" })}
          />
          {errors.clientName && <span>This field is required</span>}
          <input
            className="phoneno"
            type="number"
            placeholder="Contact Number"
            {...register("phoneNo", { required: "Number required" })}
          />
          <input
            className="address"
            type="text"
            placeholder="Address"
            {...register("address", { required: "address required" })}
          />
          {errors.address && <span>This field is required</span>}
          <input
            className="date"
            defaultValue={new Date().toISOString().slice(0, 10)}
            {...register("date")}
          />
          <br />
          <button className="create-bill" type="submit">
            Create Bill
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
