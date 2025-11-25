import React, { useEffect, useState } from "react";
import "../CSS/AllProducts.css";
import { useNavigate } from "react-router-dom";

function Billing() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:3000/products", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

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
  }, []);

  return (
    <div className="all-products-container">
      {deleteMsg && (
        <span
          className="delete-message"
          style={{ color: "#189595ff", fontSize: "15px" }}
        >
          {deleteMsg}
        </span>
      )}
      <h2 className="title">All Products</h2>

      {products.length > 0 ? (
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
                  {/* <button className="edit-btn" onClick={() => addbtn(p)}>
                    Add
                  </button> */}

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Product is Loading</p>
      )}
    </div>
  );
}

export default Billing;
