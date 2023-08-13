import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Editor from "../Editor";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function createNewPost(ev) {
    const data = new FormData();
    data.set("title", title);
    data.set("summary", summary);
    data.set("content", content);
    data.set("file", files[0]);
    ev.preventDefault();

    if (!content.trim()) {
      setError("Content is required.");
      return; // Return early if content is empty
    }

    setLoading(true);
    const response = await fetch("https://byteblogg.onrender.com/post", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: data,
      credentials: "include",
    });
    setLoading(false);

    if (response.ok) {
      setRedirect(true);
    }
  }

  if (redirect) {
    return <Navigate to={"/explore"} />;
  }

  
  const handleCloseSnackbar = () => {
    setError(null);
  };

  return (
    <>
      <div
        style={{ background: "#fffcfc", borderRadius: "10px", height: "600px" }}
      >
        <form onSubmit={createNewPost} style={{ padding: "20px" }}>
          <input
            type="title"
            placeholder={"Title"}
            required="true"
            value={title}
            onChange={(ev) => setTitle(ev.target.value)}
          />
          <input
            type="summary"
            placeholder={"Summary"}
            required="true"
            value={summary}
            onChange={(ev) => setSummary(ev.target.value)}
          />
          <input
            required="true"
            type="file"
            onChange={(ev) => setFiles(ev.target.files)}
          />
          <Editor value={content} onChange={setContent} />

          <button
            className="publish-btn"
            style={{
              marginTop: "50px",
              width: "20%",
              marginLeft: "20px",
              fontSize: "15px",
              fontWeight: "700",
            }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Publish"}
          </button>
        </form>
      </div>
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <MuiAlert
          onClose={handleCloseSnackbar}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </MuiAlert>
      </Snackbar>
    </>
  );
}
