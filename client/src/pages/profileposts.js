import { useSelector } from "react-redux";
import Post from "../Post";
import { useEffect, useState } from "react";
import { Card, Skeleton, Typography } from "@mui/material";

export default function ProfilePost({ userId }) {
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
        console.log(posts);
        setAllPosts(posts.filter((post) => post.author._id === userId));
        setFilteredPosts(posts.filter((post) => post.author._id === userId));
        console.log(filteredPosts);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
        setLoading(false);
      });
  }, [userId]);

  return (
    <>
      {loading ? (
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
