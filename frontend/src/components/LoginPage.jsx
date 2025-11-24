import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
function LoginPage() {
  const { register, handleSubmit, watch, formState: { errors },} = useForm();

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const res = await fetch("http://localhost:3000/login", {
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
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <span className="admin-headline">ADMIN LOGIN</span>
        <input
          type="text"
          placeholder="Username"
          {...register("username", { required: "Username is required" })}
        />
        {errors.username && <div>{errors.username.message}</div>}
        <input
          type="password"
          placeholder="Passward"
          {...register("password", { required: "passward is required" })}
        />
        {errors.password && <span>{errors.password.message}</span>}
        <button className="submit-btn" type="submit">
          Login
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
