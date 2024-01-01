import { useSelector } from "react-redux";
import Post from "../Post";
import { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";

export default function IndexPage({ userId, isProfile = false }) {
  const [allPosts, setAllPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true); // Added loading state
  const category = useSelector((state) => state.category.value);

  useEffect(() => {
    setLoading(true); // Set loading to true when starting to fetch posts
    fetch("https://byteblogg.onrender.com/post")
      .then((response) => response.json())
      .then((posts) => {
        if (isProfile) {
          setAllPosts(posts.filter((post) => post.author._id === userId));
          setFilteredPosts(posts.filter((post) => post.author._id === userId));
        } else {
          setFilteredPosts(posts);
          setAllPosts(posts);
        }
        setLoading(false); // Set loading to false after fetching posts
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
        setLoading(false); // Set loading to false in case of an error
      });
  }, [isProfile, userId]);

  useEffect(() => {
    setLoading(true); // Set loading to true when starting to filter posts
    if (category === "explore") {
      setFilteredPosts(allPosts);
    } else {
      if (category === "Others") {
        setFilteredPosts(
          allPosts.filter(
            (post) =>
              post.category !== "Science" &&
              post.category !== "Culture" &&
              post.category !== "Sports" &&
              post.category !== "Business" &&
              post.category !== "Politics" &&
              post.category !== "Technology"
          )
        );
      } else if (category === "Science") {
        setFilteredPosts(
          allPosts.filter(
            (post) =>
              post.category === "Science" || post.category === "Technology"
          )
        );
      } else {
        setFilteredPosts(allPosts.filter((post) => post.category === category));
      }
    }
    setLoading(false); // Set loading to false after filtering posts
  }, [category, allPosts]);

  return (
    <>
      {loading ? (
        <CircularProgress style={{ margin: "20px auto", display: "flex" }} />
      ) : (
        filteredPosts.length > 0 &&
        filteredPosts.map((post, i) => <Post key={i} {...post} />)
      )}
    </>
  );
}
