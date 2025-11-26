import React, { useEffect, useState } from "react";
import "../CSS/AllProducts.css";
import { useNavigate } from "react-router-dom";

function AllProducts() {
  const [products, setProducts] = useState([]);
  const [deleteMsg, setDeleteMsg] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);
  const navigate = useNavigate();

  const editProduct = (product) => {
    navigate(`/dashboard/editproduct/${product._id}`);
  };

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

  const deleteProduct = async (product) => {
    if (
      !window.confirm(`Do you want to delete product: ${product.productName}?`)
    ) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/products/${product._id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const response = await res.json();

      if (response.success) {
        setDeleteMsg("Product Deleted Successfully");
        setTimeout(() => setDeleteMsg(""), 2000);
        setProducts((prev) => prev.filter((p) => p._id !== product._id));
      } else {
        setDeleteMsg("Failed to delete product");
        setTimeout(() => setDeleteMsg(""), 2000);
      }
    } catch (err) {
      console.log("Delete error:", err);
    }
  };

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
      <label className="search-wrapper">
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </label>
      {loading ? ( <p>Loading....</p> ) : products.length > 0 ? (
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
                    onClick={() => deleteProduct(p)}
                  >
                    Delete
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

export default AllProducts;
