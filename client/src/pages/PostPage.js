import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { formatISO9075 } from "date-fns";
import { UserContext } from "../UserContext";
import { Link } from "react-router-dom";

export default function PostPage() {
  const [postInfo, setPostInfo] = useState(null);
  const { setUserInfo, userInfo } = useContext(UserContext);
  const { id } = useParams();
  const [following, setFollowing] = useState([]);
  const [isFollowingAuthor, setIsFollowingAuthor] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const userid = localStorage.getItem("id");

  useEffect(() => {
    fetch(`https://byteblogg.onrender.com/post/${id}`)
      .then((response) => response.json())
      .then((postInfo) => {
        setPostInfo(postInfo);
        setIsLiked(Boolean(postInfo?.likes[userid]));
        setLikeCount(Object.keys(postInfo?.likes).length);
      })
      .catch((error) => {
        console.error("Error fetching post data:", error);
      });
  }, [id]);

  useEffect(() => {
    const updateViewCount = async () => {
      try {
        await fetch(`https://byteblogg.onrender.com/post/${id}/viewcount`, {
          method: "PATCH",
        });
      } catch (error) {
        console.error("Error updating view count:", error);
      }
    };

    updateViewCount();
  }, [id]);

  useEffect(() => {
    const fetchfollowing = async () => {
      try {
        const response = await fetch(
          `https://byteblogg.onrender.com/user/${userInfo.id}/following`,
          {
            method: "GET",
          }
        );
        const data = await response.json();
        setFollowing(data);
        setIsFollowingAuthor(data.includes(postInfo?.author?._id));
      } catch (error) {
        console.error("Error :", error);
      }
    };

    if (userInfo.id) {
      fetchfollowing();
    }
  }, [userInfo, postInfo]);

  const patchFollower = async () => {
    try {
      const response = await fetch(
        `https://byteblogg.onrender.com/user/${userInfo.id}/${postInfo?.author?._id}`,
        {
          method: "PATCH",
        }
      );
      const data = await response.json();
      setFollowing(data);
      setIsFollowingAuthor(data.includes(postInfo?.author?._id));
    } catch (error) {
      console.error("Error patching follower:", error);
    }
  };

  const patchLike = async () => {
    const response = await fetch(
      `https://byteblogg.onrender.com/post/${id}/like`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: userid }),
      }
    );
    const updatedPost = await response.json();

    // Update the likes data in the UserContext
    setUserInfo((prevUserInfo) => ({
      ...prevUserInfo,
      likes: updatedPost.likes,
    }));

    // Update the likeCount state with the new likes data
    setLikeCount(Object.keys(updatedPost.likes).length);

    // Update the isLiked state based on the updatedPost.likes
    setIsLiked(Boolean(updatedPost.likes[userid]));
  };

  if (!postInfo) return null;

  return (
    <div className="post-page">
      <h1>{postInfo.title}</h1>
      <time>{formatISO9075(new Date(postInfo.createdAt))}</time>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "20px",
          fontSize: "15px",
        }}
        className="author"
      >
        by @{postInfo.author.username}
        {userInfo.id !== postInfo.author._id && (
          <div style={{ marginBottom: "0px" }} className="edit-row">
            <button className="bn632-hover bn26" onClick={patchFollower}>
              {isFollowingAuthor ? "Following" : "Follow"}
            </button>
          </div>
        )}
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
      </div>
      {userInfo.id === postInfo.author._id && (
        <div className="edit-row">
          <Link className="edit-btn" to={`/edit/${postInfo._id}`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
              />
            </svg>
            Edit this post
          </Link>
        </div>
      )}
      <div className="image">
        <img src={`https://byteblogg.onrender.com/${postInfo.cover}`} alt="" />
      </div>
      <div
        className="content"
        dangerouslySetInnerHTML={{ __html: postInfo.content }}
      />
    </div>
  );
}
