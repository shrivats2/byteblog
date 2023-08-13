import { formatISO9075 } from "date-fns";
import { Link, useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { selectedCategory } from "./features/category";
import { useState, useContext } from "react";
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
  const [viewcount, setviewcount] = useState(views);
  const { setUserInfo, userInfo } = useContext(UserContext);
  const [likeCount, setLikeCount] = useState(Object.keys(likes).length);
  const [isLiked, setIsLiked] = useState(Boolean(likes[userInfo?.id]));
  const userid = userInfo?.id;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const patchLike = async () => {
    const response = await fetch(`https://byteblogg.onrender.com/post/${_id}/like`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: userid }),
    });
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
    <>
      <div
        className="post"
        style={{
          borderStyle: "solid",
          borderRadius: "5px",
          width: "auto",
          background: "white",
        }}
      >
        <div className="image">
          <Link to={`/post/${_id}`}>
            <img
              style={{ borderRadius: "0px", height: "100%" }}
              src={"https://byteblogg.onrender.com/" + cover}
              alt=""
            />
          </Link>
        </div>
        <div className="texts">
          <Link to={`/post/${_id}`}>
            <h2>{title}</h2>
          </Link>
          <Chip onClick={() => handleCategoryClick(category)} style={{marginTop:"5px",borderColor:"#ff00fc",fontWeight:"700"}} label={category} variant="outlined" />
          <p style={{ alignItems: "center" }} className="info">
            <a href="/#" className="author">
              {author.username}
            </a>
            <time>{formatISO9075(new Date(createdAt))}</time>
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
          </p>
          <p className="summary">{summary}</p>
        </div>
      </div>
    </>
  );
}
