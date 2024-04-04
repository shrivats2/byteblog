import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import Editor from "../Editor";
import { CircularProgress } from "@mui/material";

export default function EditPost() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialTitle, setInitialTitle] = useState("");
  const [initialSummary, setInitialSummary] = useState("");
  const [initialContent, setInitialContent] = useState("");

  useEffect(() => {
    fetch("https://byteblogg.onrender.com/post/" + id).then((response) => {
      response.json().then((postInfo) => {
        setTitle(postInfo.title);
        setContent(postInfo.content);
        setSummary(postInfo.summary);
        setInitialTitle(postInfo.title);
        setInitialContent(postInfo.content);
        setInitialSummary(postInfo.summary);
      });
    });
  }, []);

  async function updatePost(ev) {
    setLoading(true);
    ev.preventDefault();
    if (
      title === initialTitle &&
      summary === initialSummary &&
      content === initialContent
    ) {
      alert("No changes to update.");
      setLoading(false);
      return;
    }

    const data = new FormData();
    data.set("title", title);
    data.set("summary", summary);
    data.set("content", content);
    data.set("id", id);
    if (files?.[0]) {
      data.set("file", files?.[0]);
    }
    const response = await fetch("https://byteblogg.onrender.com/post", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: data,
      credentials: "include",
    });
    if (response.ok) {
      setRedirect(true);
    }
    setLoading(false);
  }

  if (redirect) {
    return <Navigate to={"/post/" + id} />;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "100px" }}>
      <form onSubmit={updatePost}>
        <input
          type="title"
          placeholder={"Title"}
          value={title}
          onChange={(ev) => setTitle(ev.target.value)}
        />
        <input
          type="summary"
          placeholder={"Summary"}
          value={summary}
          onChange={(ev) => setSummary(ev.target.value)}
        />
        <input type="file" onChange={(ev) => setFiles(ev.target.files)} />
        <Editor onChange={setContent} value={content} />
      </form>
      <button onClick={updatePost}>
        {" "}
        {loading ? <CircularProgress size={24} /> : "Update post"}
      </button>
    </div>
  );
}
