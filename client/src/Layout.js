import Header from "./Header";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import { Box, useMediaQuery } from "@mui/material";
import FollowerListWidget from "./components/FollowerListWidget";
import { useEffect } from "react";

export default function Layout() {
  const userId = localStorage.getItem("id");
  const isNonMobileScreens = useMediaQuery("(min-width: 1200px)");
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      navigate("/login");
    } else if (navigate.location?.pathname === "/") {
      navigate("/explore");
    }
  }, [userId, navigate]);

  return (
    <Box>
      <Header />
      <Box
        sx={{ paddingBottom: "20px" }}
        display={isNonMobileScreens ? "flex" : "block"}
      >
        <Box
          padding="20px 0px 0px 15px"
          display="flex"
          justifyContent={!isNonMobileScreens && "center"}
          flexDirection={isNonMobileScreens && "column"}
          sx={{ gap: "30px" }}
        >
          <Navbar />
          {isNonMobileScreens && <FollowerListWidget userId={userId} />}
        </Box>
        <Box
          width="100%"
          padding="10px"
          display="flex"
          gap="3rem"
          justifyContent={!isNonMobileScreens && "center"}
          sx={{ flexFlow: "wrap" }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
