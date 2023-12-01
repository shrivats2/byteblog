import React, { useState, useContext } from "react";
import { formatISO9075 } from "date-fns";
import { Link, useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { selectedCategory } from "./features/category";
import Tooltip from "@mui/material/Tooltip";
import { UserContext } from "./UserContext";
import {
  Chip,
  Card,
  CardContent,
  CardActions,
  Typography,
} from "@mui/material";
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
    <Card>
      <div
        style={{ display: "flex", justifyContent: "center" }}
        className="image"
      >
        <Link to={`/post/${_id}`}>
          <img
            style={{ borderRadius: "0px", height: "100%" }}
            src={"https://byteblogg.onrender.com/" + cover}
            alt=""
          />
        </Link>
      </div>
      <CardContent>
        <Link to={`/post/${_id}`}>
          <Typography sx={{ padding: "12px" }} variant="h6" component="div">
            {title}
          </Typography>
        </Link>
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
        <Typography
          sx={{
            alignItems: "center",
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
          }}
          className="info"
        >
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
        </Typography>
        <Typography className="summary">{summary}</Typography>
      </CardContent>
    </Card>
  );
}
