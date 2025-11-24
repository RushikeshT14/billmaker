import React, { useEffect, useState } from "react";
import "../CSS/AllProducts.css";
import { useNavigate } from "react-router-dom";

function AllProducts() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const editProduct = (product) => {
    navigate("/dashboard/editproduct", { state: product });
  };

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

        if (!data.success){
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
                  <button className="edit-btn" onClick={() => editProduct(p)}>
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => console.log("Delete", p._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No products found.</p>
      )}
    </div>
  );
}

export default AllProducts;
