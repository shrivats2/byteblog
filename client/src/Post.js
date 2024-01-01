import React, { useState, useContext } from "react";
import { formatISO9075 } from "date-fns";
import { Link, useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { selectedCategory } from "./features/category";
import Tooltip from "@mui/material/Tooltip";
import { UserContext } from "./UserContext";
import { Chip } from "@mui/material";
import { useDispatch } from "react-redux";

export default function Post({
  _id,
  title,
  summary,
  cover,
  category,
  content,
  createdAt,
  author,
  likes,
  views,
}) {
  const [viewcount, setViewCount] = useState(views);
  const { setUserInfo, userInfo } = useContext(UserContext);
  const [likeCount, setLikeCount] = useState(Object.keys(likes).length);
  const [isLiked, setIsLiked] = useState(Boolean(likes[userInfo?.id]));
  const userid = userInfo?.id;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const patchLike = async () => {
    const response = await fetch(
      `https://byteblogg.onrender.com/post/${_id}/like`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: userid }),
      }
    );
    const updatedPost = await response.json();
    setUserInfo((prevUserInfo) => ({
      ...prevUserInfo,
      likes: updatedPost.likes,
    }));
    setLikeCount(Object.keys(updatedPost.likes).length);
    setIsLiked(Boolean(updatedPost.likes[userid]));
  };

  const handleCategoryClick = (category) => {
    dispatch(selectedCategory(category));
    navigate("/explore");
  };

  return (
    <div className="card">
      <div className="card-img-holder">
        <Link style={{ textDecoration: "none" }} to={`/post/${_id}`}>
          <img
            src={"https://byteblogg.onrender.com/" + cover}
            alt="Blog-img"
          />
        </Link>
      </div>
      <Link style={{ textDecoration: "none" }} to={`/post/${_id}`}>
        <h3 className="blog-title">{title}</h3>
      </Link>
      <div className="blog-time">
        <div className="blog-card-section-1">
          <a href={`/profile/${author._id}`} className="author">
            @{author.username}
          </a>
          <time style={{ fontStyle: "italic", color: "grey" }}>
            {formatISO9075(new Date(createdAt))}
          </time>
        </div>
        <div className="blog-card-section-2">
          <VisibilityIcon /> {viewcount}
          <Tooltip title={isLiked ? "Unlike" : "Like"}>
            <div style={{ display: "flex", color: "#e0245e" }}>
              <label className="like" onClick={patchLike}>
                <input
                  style={{ display: "none" }}
                  defaultChecked={isLiked}
                  type="checkbox"
                />
                <div className="hearth" />
              </label>
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: "1.5rem",
                }}
              >
                {likeCount}
              </span>
            </div>
          </Tooltip>
        </div>
      </div>
      <p className="description">{summary}</p>
      <div className="options">
        <span>
          <Chip
            onClick={() => handleCategoryClick(category)}
            style={{
              marginBottom: "12px",
              marginTop: "5px",
              borderColor: "#ff00fc",
              fontWeight: "700",
            }}
            label={category}
            variant="outlined"
          />
        </span>
        <Link style={{ textDecoration: "none" }} to={`/post/${_id}`}>
          <button className="btn">Read Blog</button>
        </Link>
      </div>
    </div>
  );
}
