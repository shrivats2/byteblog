import {
  ManageAccountsOutlined,
  EditOutlined,
  LocationOnOutlined,
  WorkOutlineOutlined,
} from "@mui/icons-material";
import { styled } from "@mui/system";
import { Box, Typography, Divider, useTheme } from "@mui/material";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserWidget = ({ userId }) => {
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
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const dark = "#fff";
  const medium = "#fff";
  const main = "#C2C2C2";

  const getUser = async () => {
    const response = await fetch(`https://byteblogg.onrender.com/user/${userId}`, {
      method: "GET",
    });
    const data = await response.json();
    setUser(data);
  };

  useEffect(() => {
    getUser();
  }, [userId]);

  if (!user) {
    return null;
  }

  const { _id, username, following, followers } = user;

  return (
    <WidgetWrapper>
      <FlexBetween
        gap="0.5rem"
        pb="1.1rem"
        onClick={() => navigate(`/profile/${userId}`)}
      >
        <FlexBetween gap="1rem">
          <img
            style={{ objectFit: "cover", borderRadius: "50%" }}
            width="35px"
            height="35px"
            alt="user"
            src="/asset/profile_pic.jpg"
          />
          <Box>
            <Typography
              variant="h4"
              color={dark}
              fontWeight="500"
              sx={{
                "&:hover": {
                  color: "#000000",
                  cursor: "pointer",
                },
              }}
            >
              {username}
            </Typography>
          </Box>
        </FlexBetween>
      </FlexBetween>

      <Divider color="white" />

      <Box p="1rem 0">
        <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
          <LocationOnOutlined fontSize="large" sx={{ color: medium }} />
          <Typography color={medium} fontWeight="900">
            Mumbai
          </Typography>
        </Box>
      </Box>

      <Divider color="white" />
      <Box p="1rem 0">
        <FlexBetween mb="0.5rem">
          <Typography color={medium} fontWeight="900">
            Followers
          </Typography>
          <Typography color={medium} fontWeight="500">
            {user.followers?.length}
          </Typography>
        </FlexBetween>
        <FlexBetween>
          <Typography color={medium} fontWeight="900">
            Following
          </Typography>
          <Typography color={medium} fontWeight="500">
            {user.following?.length}
          </Typography>
        </FlexBetween>
      </Box>

      <Divider color="white" />
    </WidgetWrapper>
  );
};

export default UserWidget;
