import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import "../CSS/AddProduct.css";
const API = import.meta.env.VITE_API_URL;

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API}/products/${id}`, {
          credentials: "include",
        });
        const data = await res.json();

        if (data.success) {
          reset({
            productName: data.product.productName,
            category: data.product.category,
            MRP: data.product.MRP,
            sellingPrice: data.product.sellingPrice,
          });
        } else {
          navigate("/dashboard/allproduct");
        }
      } catch (err) {
        console.error(err);
        navigate("/dashboard/allproduct");
      }
    };

    fetchProduct();
  }, [id, reset, navigate]);

  const onSubmit = async (formData) => {
    try {
      const res = await fetch(`${API}/products/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await res.json();

      if (result.success) {
        setMessage("Product Updated Successfully!");
        setTimeout(() => navigate("/dashboard/allproduct"), 1500);
      } else {
        setMessage(result.message);
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error");
    }
  };

  return (
    <div className="add-product-container">
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <span className="add-product-headline">EDIT PRODUCT</span>

        <input
          type="text"
          placeholder="Product Name"
          {...register("productName", { required: "Product name is required" })}
        />
        {errors.productName && <p>{errors.productName.message}</p>}

        <input type="text" placeholder="Category" {...register("category")} />

        <input
          type="number"
          placeholder="MRP"
          {...register("MRP", { required: "MRP is required", min: 1 })}
        />
        {errors.MRP && <p>{errors.MRP.message}</p>}

        <input
          type="number"
          placeholder="Selling Price"
          {...register("sellingPrice", { required: "Selling price is required", min: 1 })}
        />
        {errors.sellingPrice && <p>{errors.sellingPrice.message}</p>}

        {message && <p style={{ color: "black" }}>{message}</p>}

        <button className="add-btn" type="submit">Save Changes</button>
      </form>
    </div>
  );
}

export default EditProduct;
