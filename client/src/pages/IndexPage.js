import { useSelector } from "react-redux";
import Post from "../Post";
import { useEffect, useState } from "react";
import { Card, Skeleton, Typography } from "@mui/material";

export default function IndexPage({ userId, isProfile = false }) {
  const [allPosts, setAllPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterPostloading, setfilterPostLoading] = useState(false);
  const category = useSelector((state) => state.category.value);

  useEffect(() => {
    setLoading(true);
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
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
        setLoading(false);
      });
  }, [isProfile, userId]);

  useEffect(() => {
    setfilterPostLoading(true);
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
    setfilterPostLoading(false);
  }, [category, allPosts]);

  return (
    <>
      {loading ? (
        <IndexPageSkeleton />
      ) : filterPostloading ? (
        <IndexPageSkeleton />
      ) : (
        filteredPosts.length > 0 &&
        filteredPosts.map((post, i) => <Post key={i} {...post} />)
      )}
    </>
  );
}

const IndexPageSkeleton = () => {
  return (
    <>
      {Array(4)
        .fill()
        .map((_, key) => (
          <Card sx={{ height: "600px" }}>
            <Skeleton
              sx={{ borderRadius: "15px", margin: "20px" }}
              width={310}
              height={300}
            />
            {Array(4)
              .fill()
              .map((_, key) => (
                <Typography
                  sx={{ margin: "20px" }}
                  component="div"
                  key={key}
                  variant="body1"
                >
                  <Skeleton />
                </Typography>
              ))}
          </Card>
        ))}
    </>
  );
};
