import ReactQuill from "react-quill";
import React from "react";
import { useMediaQuery } from "@mui/material";

export default function Editor({ value, onChange }) {
  const isMobileScreens = useMediaQuery("(min-width: 400px)");
  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
  ];

  const editorStyle = {
    minWidth: "200px",
    maxWidth: "100vw",
    margin: "0 auto",
    height: "60vh",
  };

  return (
    <div style={{ width: "100%" }}>
      <div style={editorStyle}>
        <ReactQuill
          value={value}
          theme={"snow"}
          onChange={onChange}
          modules={modules}
          formats={formats}
          style={{ width: !isMobileScreens ? "80vw" : "70vw", height: "100%" }}
        />
      </div>
    </div>
  );
}
