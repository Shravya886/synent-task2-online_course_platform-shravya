import { Link } from "react-router-dom";
import "../App.css";

function Home() {

  return (

    <div>

      <nav className="navbar">

        <h2>Online Course Platform</h2>

        <div>

          <Link to="/login">
            <button className="nav-btn">
              Login
            </button>
          </Link>

          <Link to="/register">
            <button className="nav-btn">
              Register
            </button>
          </Link>

        </div>

      </nav>

      <section className="hero">

        <h1>Learn New Skills Online</h1>

        <p>
          Explore courses in Web Development,
          AI, Data Science, Programming and more.
        </p>

        <button className="explore-btn">
          Explore Courses
        </button>

      </section>

    </div>

  );
}

export default Home;