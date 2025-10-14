// Home.js
import { Link } from "react-router-dom";
import "../styles/Navbar.css";
const Home = () => {
  return (
    <div className="home-container">
      <h1>Welcome to My App</h1>
      <nav className="navbar">
        <Link to="/login">Login</Link>
        <Link to="/register">Sign Up</Link>
        <Link to="/dashboard">Dashboard</Link>
      </nav>
    </div>
  );
};

export default Home;
