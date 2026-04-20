import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="app-shell">
      <div className="center-wrap">
        <div className="hero-card">
          <div className="hero-content">
            <h1 className="hero-title">NoteSpace</h1>
            <p className="hero-subtitle">
              Write down any thought, idea or reminder 
            </p>

            <div className="hero-actions">
              <Link to="/register">
                <button className="secondary-btn">Create Account</button>
              </Link>

              <Link to="/login">
                <button className="primary-btn">Login</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;