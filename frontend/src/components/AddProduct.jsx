import React, { useState } from "react";
import { useForm } from "react-hook-form";
import "../CSS/AddProduct.css";
const API = import.meta.env.VITE_API_URL;
function AddProduct() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [message, setMessage] = useState("");

  const onSubmit = async (data) => {
    try {
      const res = await fetch(`${API}/addproduct`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productName: data.productName,
          category: data.category,
          MRP: data.MRP,
          sellingPrice: data.sellingPrice,
        }),
      });

      const result = await res.json();

      if (result.success) {
        setMessage("Product Added Successfully!");
        reset();
      } else {
        setMessage(result.message);
      }

      setTimeout(() => setMessage(""), 1500);
    } catch (err) {
      setMessage(" Server error");
      console.log(err);
    }
  };

  return (
    <div className="add-product-container">
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <span className="add-product-headline">ADD PRODUCT</span>

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
          {...register("MRP", {
            required: "MRP is required",
            min: { value: 1, message: "MRP must be at least 1" },
          })}
        />
        {errors.MRP && <p>{errors.MRP.message}</p>}

        <input
          type="number"
          placeholder="Selling Price"
          {...register("sellingPrice", {
            required: "Selling price is required",
            min: { value: 1, message: "Selling Price must be at least 1" },
          })}
        />
        {errors.sellingPrice && <p>{errors.sellingPrice.message}</p>}
        {message && <p style={{ color: "black" }}>{message}</p>}

        <button className="add-btn" type="submit">
          Add Product
        </button>
      </form>
    </div>
  );
}

export default AddProduct;
