import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import IndexPage from "./pages/IndexPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { UserContextProvider } from "./UserContext";
import CreatePost from "./pages/CreatePost";
import PostPage from "./pages/PostPage";
import EditPost from "./pages/EditPost";
import { CssBaseline } from "@mui/material";
import { BrowserRouter } from "react-router-dom";
import Profilepage from "./pages/profilepage";
import { useEffect } from "react";

function App() {
  const isAuth = localStorage.getItem("id");
  return (
    <BrowserRouter>
      <UserContextProvider>
        <CssBaseline />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/explore" element={<IndexPage />} />
            <Route path="/create" element={<CreatePost />} />
            <Route path="/post/:id" element={<PostPage />} />
            <Route path="/edit/:id" element={<EditPost />} />
          </Route>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile/:userId" element={<Profilepage />} />
        </Routes>
      </UserContextProvider>
    </BrowserRouter>
  );
}

export default App;
