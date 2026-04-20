import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { useNavigate, Link } from "react-router-dom";
import { REGISTER_USER } from "../graphql/mutations";

function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const [registerUser] = useMutation(REGISTER_USER);

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const result = await registerUser({
        variables: { username, email, password }
      });

      localStorage.setItem("token", result.data.register.token);
      setMessage("Registration successful");
      navigate("/notes");
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="form-page">
      <div className="form-card">
        <div className="form-body">
          <h2 className="form-title">Register</h2>
          <p className="form-subtitle">Create your account to start saving notes.</p>

          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label className="form-label">Username</label>
              <input
                type="text"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

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
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="secondary-btn">
              Register
            </button>
          </form>

          <p className="message-text">{message}</p>

          <p className="form-footer">
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;