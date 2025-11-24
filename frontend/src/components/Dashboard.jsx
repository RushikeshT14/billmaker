import { Link, Outlet, useNavigate } from "react-router-dom";
import "../CSS/Dashboard.css";
import { useEffect } from "react";

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:3000/logout", {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();
      if (data.success) {
        navigate("/");
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
  };
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:3000/checkauth", {
          credentials: "include",
        });

        const data = await res.json();

        if (!data.success) {
          navigate("/");
        }
      } catch (err) {
        console.error("Auth check error:", err);
        navigate("/");
      }
    };

    checkAuth();
  }, []);

  return (
    <div className="dashboard-main">
      <aside className="sidebar">
        <h2 className="sidebar-title">Admin Panel</h2>

        <ul className="sidebar-links">
          <li><Link to="allproduct"><i className="fa-solid fa-arrow-right"></i>     Products </Link></li>
          <li><Link to="addproduct"><i className="fa-solid fa-arrow-right"></i>     Add Product </Link></li>
          {/* <li><Link to="editproduct"><i className="fa-solid fa-arrow-right"></i>     Edit Product </Link></li> */}
          <li><Link to="billing"><i className="fa-solid fa-arrow-right"></i>     Billing </Link></li> 
          <li><Link to="billhistory"><i className="fa-solid fa-arrow-right"></i>     Bill History </Link></li>
        </ul>
      </aside>

      <div className="right-wrapper">
        <nav className="top-navbar">
          <h3>Dashboard</h3>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </nav>

        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
