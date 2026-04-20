import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { useNavigate, Link } from "react-router-dom";
import { LOGIN_USER } from "../graphql/mutations";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const [loginUser] = useMutation(LOGIN_USER);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const result = await loginUser({
        variables: { email, password }
      });

      localStorage.setItem("token", result.data.login.token);
      setMessage("Login successful");
      navigate("/notes");
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="form-page">
      <div className="form-card">
        <div className="form-body">
          <h2 className="form-title">Login</h2>
          <p className="form-subtitle">Sign in to access your notes.</p>

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="primary-btn">
              Login
            </button>
          </form>

          <p className="message-text">{message}</p>

          <p className="form-footer">
            Don&apos;t have an account? <Link to="/register">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;