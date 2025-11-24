import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import "../CSS/AddProduct.css";

function EditProduct() {
  const { state: product } = useLocation();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
    if (product) {
      reset({
        productName: product.productName,
        category: product.category,
        MRP: product.MRP,
        sellingPrice: product.sellingPrice,
      });
    }
  }, [product, reset]);

  const onSubmit = async (data) => {
    try {
      const res = await fetch(
        `http://localhost:3000/editproduct/${product._id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const result = await res.json();

      if (result.success) {
        setMessage("Product Updated Successfully!");

        setTimeout(() => {
          setMessage("");
          navigate("/dashboard/allproduct");
        }, 1500);
      } else {
        setMessage(result.message);
      }
    } catch (err) {
      console.log(err);
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
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default EditProduct;
