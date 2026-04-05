import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
const API = import.meta.env.VITE_API_URL;
function LoginPage() {
  const { register, handleSubmit, watch, formState: { errors },} = useForm();
  const [loading,setloading]=useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setloading(true);  
    try {
      const res = await fetch(`${API}/login`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const responseData = await res.json();

      if (responseData.success) {
        navigate("/dashboard");
      } else {
        alert("Wrong username or password");
      }
    } catch (err) {
      console.error("Error:", err);
    }
    setloading(false);
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <span className="admin-headline">ADMIN LOGIN</span>
        <input
          type="text"
          placeholder="Username [admin]"
          {...register("username", { required: "Username is required" })}
        />
        {errors.username && <div>{errors.username.message}</div>}
        <input
          type="password"
          placeholder="Passward [1234]"
          {...register("password", { required: "passward is required" })}
        />
        {errors.password && <span>{errors.password.message}</span>}
        
      {loading && <div className="loader"></div>}
        <button className="submit-btn" type="submit">
          Login
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
