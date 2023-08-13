import React, { useContext, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import Header from "../Header";
import CircularProgress from "@mui/material/CircularProgress";
import ErrorIcon from "@mui/icons-material/Error";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { setUserInfo } = useContext(UserContext);

  async function login(ev) {
    ev.preventDefault();
    setLoading(true);
    const response = await fetch("https://byteblog-j4gb.onrender.com/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    setLoading(false);

    if (response.ok) {
      response.json().then((userInfo) => {
        setUserInfo(userInfo);
        localStorage.setItem("token", userInfo.token);
        localStorage.setItem("id", userInfo.id);
        setRedirect(true);
      });
    } else {
      const data = await response.json();
      setError(data.message);
    }
  }

  if (redirect) {
    return <Navigate to={"/explore"} />;
  }

  return (
    <>
      <Header />
      <div className="box-form">
        <div className="left">
          <div className="overlay">
            <h1>Be Fanatic About Blogging!</h1>
            <p>
              Join us and unleash the writer within. Write your heart out and
              let your words conquer the world!
            </p>
            <span>
              <p>Ready to Embark on a Blogging Adventure?</p>
              <a href="/explore">
                Explore Blogs
              </a>
            </span>
          </div>
        </div>

        <div className="right">
          <h5>Login to Your Blogging Hub</h5>
          <p>
            Don't have an account? <Link to="/register"><a href="#">Become a Blogging Wizard</a>{" "}</Link>
            in a minute!
          </p>
          <form className="login" onSubmit={login}>
            <input
              required
              type="text"
              placeholder="Enter your blogger name"
              value={username}
              onChange={(ev) => setUsername(ev.target.value)}
              autoComplete="username"
            />
            <input
              required
              type="password"
              placeholder="Magic password to unlock creativity"
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
              autoComplete="current-password"
            />
            <button disabled={loading}>
              {loading ? <CircularProgress size={24} /> : "Summon the Blog"}
            </button>
            {error && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#f8d7da",
                  color: "#721c24",
                  borderRadius: "4px",
                  padding: "10px",
                  marginTop: "10px",
                }}
              >
                <ErrorIcon sx={{ marginRight: "5px" }} />
                {error} 😞 Oops, something went wrong!
              </Box>
            )}
          </form>
        </div>
      </div>
    </>
  );
}
