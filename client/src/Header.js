import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import { styled } from "@mui/system";
import Logout from "@mui/icons-material/Logout";
import ListItemIcon from "@mui/material/ListItemIcon";
import {
  Box,
  IconButton,
  InputBase,
  Typography,
  Select,
  MenuItem,
  FormControl,
  useMediaQuery,
  Avatar,
} from "@mui/material";
import { Search, Menu, Close } from "@mui/icons-material";
import CreateIcon from "@mui/icons-material/Create";
import HomeIcon from "@mui/icons-material/Home";
import Chip from "@mui/material/Chip";

import Tooltip from "@mui/material/Tooltip";

export default function Header() {
  const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
  const { setUserInfo, userInfo } = useContext(UserContext);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const navigate = useNavigate();
  const isAuth = localStorage.getItem("id");

  useEffect(() => {
    if (isAuth) {
      fetch("https://byteblogg.onrender.com/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Send the token as a header
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Unauthorized");
          }
          return response.json();
        })
        .then((userInfo) => {
          setUserInfo(userInfo);
        })
        .catch((error) => {
          console.error("Error fetching profile:", error);
          setUserInfo(null); // Clear user info if unauthorized
        });
    }
  }, [setUserInfo]);

  function logout() {
    fetch("https://byteblogg.onrender.com/logout", {
      method: "POST",
      headers: {
        Authorization: localStorage.getItem("token"), // Send the token as a header
      },
    })
      .then(() => {
        setUserInfo(null);
        localStorage.setItem("id", "");
        localStorage.removeItem("token"); // Remove token from localStorage on logout
        navigate("/login");
      })
      .catch((error) => {
        console.error("Error logging out:", error);
      });
  }

  const username = userInfo?.username;

  const FlexBetween = styled(Box)({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  });
  const handleprofile = () => {
    navigate(`/profile/${userInfo?.id}`);
  };

  return (
    <FlexBetween
      padding="1rem 6%"
      backgroundColor="#12f0ff"
      style={{
        backgroundImage:
          "linear-gradient(to right top, #71e9ff, #00d1ff, #00b5ff, #0096ff, #0071ff, #005eff, #0047ff, #3025ff, #412bff, #4e30ff, #5836ff, #623bff)",
      }}
    >
      <FlexBetween gap="1.75rem">
        <Typography
          fontWeight="bold"
          fontSize="clamp(1rem,2rem,2.25rem)"
          color="#fff"
          onClick={() => {
            isAuth ? navigate("/explore") : navigate("/login");
          }}
          sx={{
            "&:hover": {
              color: "#00353F",
              cursor: "pointer",
            },
          }}
        >
          𐌁γ𝓽℮𐌁ʟ𝒐ġ
        </Typography>
        {isNonMobileScreens && (
          <FlexBetween
            backgroundColor="white"
            borderRadius="9px"
            gap="3rem"
            padding="0.1rem 1.5rem"
          >
            <InputBase placeholder="Search...." />
            <IconButton style={{ width: "10px" }}>
              <Search />
            </IconButton>
          </FlexBetween>
        )}
      </FlexBetween>
      {isNonMobileScreens ? (
        <FlexBetween gap="2rem">
          <Tooltip title="write">
            <Chip
              icon={
                <CreateIcon
                  sx={{ fontSize: "25px", color: "white" }}
                  style={{ cursor: "pointer" }}
                />
              }
              onClick={() => navigate("/create")}
              label="&nbsp;Write&nbsp;"
              variant="outlined"
              style={{
                background: "white",
                fontWeight: "800",
                cursor: "pointer",
              }}
            />
          </Tooltip>

          <Chip
            icon={<HomeIcon sx={{ fontSize: "25px", color: "white" }} />}
            onClick={() => {
              isAuth ? navigate("/explore") : navigate("/");
            }}
            label="Home"
            variant="outlined"
            style={{
              background: "white",
              fontWeight: "800",
              cursor: "pointer",
            }}
          />
          {isAuth && (
            <FormControl variant="standard" value={username}>
              <Select
                value={username}
                sx={{
                  backgroundColor: "#F0F0F0",
                  width: "150px",
                  borderRadius: "0.25rem",
                  p: "0.25rem 0.25rem",
                  "& .MuiSvgIcon-root": {
                    pr: "0.25rem",
                    width: "3rem",
                  },
                  "& .MuiSelect-select:focus": {
                    backgroundColor: "#F0F0F0",
                  },
                }}
                input={<InputBase />}
              >
                <MenuItem value={username} sx={{ display: "flex" }}>
                  <ListItemIcon sx={{ minWidth: "auto" }}>
                    <Avatar sx={{ width: 24, height: 24 }} />
                  </ListItemIcon>
                  <Typography>{username}</Typography>
                </MenuItem>
                <MenuItem value="My Profile" onClick={handleprofile}>
                  <ListItemIcon>
                    <Avatar sx={{ width: 24, height: 24 }} />
                  </ListItemIcon>
                  Profile
                </MenuItem>
                <MenuItem sx={{ color: "red" }} onClick={logout}>
                  {" "}
                  <ListItemIcon>
                    <Logout sx={{ color: "red" }} fontSize="small" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Select>
            </FormControl>
          )}
        </FlexBetween>
      ) : (
        <IconButton
          onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
          style={{ width: "auto", color: "white" }}
        >
          <Menu />
        </IconButton>
      )}
      {!isNonMobileScreens && isMobileMenuToggled && (
        <Box
          position="fixed"
          right="0"
          bottom="0"
          height="100%"
          zIndex="10"
          maxWidth="500px"
          minWidth="300px"
          style={{
            background:
              "linear-gradient(to left bottom, rgb(113, 233, 255), rgb(0, 209, 255), rgb(0, 181, 255), rgb(0, 150, 255), rgb(0, 113, 255), rgb(0, 94, 255), rgb(0, 71, 255), rgb(48, 37, 255), rgb(65, 43, 255), rgb(78, 48, 255), rgb(88, 54, 255), rgb(98, 59, 255))",
          }}
        >
          <Box display="flex" justifyContent="flex-end" p="1rem">
            <IconButton
              onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
              style={{ width: "auto", color: "white" }}
            >
              <Close />
            </IconButton>
          </Box>
          <FlexBetween
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            gap="3rem"
            color="white"
          >
            <Chip
              icon={
                <CreateIcon
                  sx={{ fontSize: "25px" }}
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate("/create")}
                />
              }
              onClick={() => navigate("/create")}
              label="&nbsp;Write&nbsp;"
              variant="outlined"
              style={{
                background: "white",
                fontWeight: "800",
                cursor: "pointer",
              }}
            />

            <Chip
              icon={<HomeIcon sx={{ fontSize: "25px", color: "white" }} />}
              onClick={() => {
                isAuth ? navigate("/explore") : navigate("/");
              }}
              label="Home"
              variant="outlined"
              style={{
                background: "white",
                fontWeight: "800",
                cursor: "pointer",
              }}
            />
            <FormControl variant="standard" value={username}>
              <Select
                value={username}
                sx={{
                  backgroundColor: "white",
                  width: "150px",
                  color: "black",
                  borderRadius: "0.25rem",
                  p: "0.25rem 0.25rem",
                  "& .MuiSvgIcon-root": {
                    pr: "0.25rem",
                    width: "3rem",
                  },
                }}
                input={<InputBase />}
              >
                <MenuItem value={username}>
                  <ListItemIcon sx={{ minWidth: "auto" }}>
                    <Avatar sx={{ width: 24, height: 24 }} />
                  </ListItemIcon>
                  <Typography>{username}</Typography>
                </MenuItem>
                <MenuItem value="My Profile" onClick={handleprofile}>
                  <ListItemIcon>
                    <Avatar sx={{ width: 24, height: 24 }} />
                  </ListItemIcon>
                  Profile
                </MenuItem>
                <MenuItem sx={{ color: "red" }} onClick={logout}>
                  <ListItemIcon>
                    <Logout sx={{ color: "red" }} fontSize="small" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Select>
            </FormControl>
          </FlexBetween>
        </Box>
      )}
    </FlexBetween>
  );
}
