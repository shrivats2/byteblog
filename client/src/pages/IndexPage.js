import { useSelector } from "react-redux";
import Post from "../Post";
import { useEffect, useState } from "react";

export default function IndexPage({ userId, isProfile = false }) {
  const [allPosts, setAllPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const category = useSelector((state) => state.category.value);
  useEffect(() => {
    fetch("https://byteblog-j4gb.onrender.com/post")
      .then((response) => response.json())
      .then((posts) => {
        if (isProfile) {
          setAllPosts(posts.filter((post) => post.author._id === userId));
          setFilteredPosts(posts.filter((post) => post.author._id === userId));
        } else {
          setFilteredPosts(posts);
          setAllPosts(posts);
        }
      });
  }, [isProfile, userId]);

  useEffect(() => {
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
  }, [category, allPosts]);

  return (
    <>
      {filteredPosts.length > 0 &&
        filteredPosts.map((post, i) => <Post key={i} {...post} />)}
    </>
  );
}
