import React, { useState, useEffect } from "react";
import { styled } from "@mui/system";
import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";

const FollowerListWidget = ({ userId }) => {
  const WidgetWrapper = styled(Box)(() => ({
    padding: "1.5rem 1.5rem 0.75rem 1.5rem",
    backgroundImage:
      "linear-gradient(to bottom, #71e9ff, #00d1ff, #00b5ff, #0096ff, #0071ff, #005eff, #0047ff, #3025ff, #412bff, #4e30ff, #5836ff, #623bff)",
    borderRadius: "0.75rem",
  }));
  const FlexBetween = styled(Box)({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  });
  const [following, setFollowing] = useState([]);
  const [btntext, setbtntext] = useState("Following");
  const navigate = useNavigate();
  const currentUserId = localStorage.getItem("id");

  const getFollowing = async () => {
    const response = await fetch(`https://byteblog-j4gb.onrender.com/${userId}/following`, {
      method: "GET",
    });
    const data = await response.json();
    setFollowing(data);
  };

  useEffect(() => {
    getFollowing();
  }, []);

  const patchFollower = async (_id) => {
    try {
      // Patch follower data
      const response = await fetch(
        `https://byteblog-j4gb.onrender.com/user/${userId}/${_id}`,
        {
          method: "PATCH",
        }
      );
      const data = await response.json();
      setFollowing((prevFollowing) =>
        prevFollowing.filter((person) => person._id !== _id)
      );
    } catch (error) {
      console.error("Error patching follower:", error);
    }
  };

  return (
    <WidgetWrapper>
      <Typography
        color="white"
        variant="h5"
        fontWeight="800"
        sx={{ mb: "1.5rem" }}
      >
        Following
      </Typography>
      <Box display="flex" flexDirection="column" gap="0.5rem">
        {following.map((follow, i) => (
          <FlexBetween key={i}>
            <FlexBetween gap="1rem">
              <Box
                onClick={() => {
                  console.log("clicked");
                }}
                display="flex"
                gap="10px"
                alignItems="center"
              >
                <Box width="35px" height="35px">
                  <img
                    style={{ objectFit: "cover", borderRadius: "50%" }}
                    width="35px"
                    height="35px"
                    alt="user"
                    src="/asset/profile_pic.jpg"
                  />
                </Box>
                <Typography
                  color="white"
                  variant="h5"
                  fontWeight="500"
                  fontSize="16px"
                  sx={{
                    "&:hover": {
                      color: "black",
                      cursor: "pointer",
                    },
                  }}
                  onClick={() => navigate(`/profile/${follow._id}`)}
                >
                  {follow.username}
                </Typography>
              </Box>
            </FlexBetween>

            {userId == currentUserId && (
              <button
                className={
                  btntext == "Following" ? "button-17-following" : "button-17"
                }
                role="button"
                onClick={() => patchFollower(follow._id)}
              >
                {btntext}
              </button>
            )}
          </FlexBetween>
        ))}
      </Box>
    </WidgetWrapper>
  );
};

export default FollowerListWidget;
