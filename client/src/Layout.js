import Header from "./Header";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import { Box, useMediaQuery } from "@mui/material";
import FollowerListWidget from "./components/FollowerListWidget";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

export default function Layout() {
  const location = useLocation();
  const userId = localStorage.getItem("id");
  const isNonMobileScreens = useMediaQuery("(min-width: 1200px)");
  const navigate=useNavigate();

  useEffect(()=>{
    if(!userId)
    {
      navigate("/login");
    }
  },[userId])
  
  return (
    <Box>
      <Header />
      <Box display={isNonMobileScreens ? "flex" : "block"}>
        <Box
          padding="20px 0px 0px 15px"
          display={!isNonMobileScreens && "flex"}
          justifyContent={!isNonMobileScreens && "center"}
        >
          <Navbar />
        </Box>
        <Box
          width="100%"
          padding="1rem 0rem 0rem 1rem"
          display="flex"
          gap="0.5rem"
          justifyContent="space-between"
        >
          <Box
            flexBasis={
              location.pathname === "/explore"
                ? isNonMobileScreens
                  ? "70%"
                  : "100%"
                : "95%"
            }
          >
            <Outlet />
          </Box>
          <Box
            flexBasis={
              location.pathname === "/explore" && isNonMobileScreens
                ? "30%"
                : "0%"
            }
          >
            {location.pathname === "/explore" && isNonMobileScreens && (
              <>
                <Box m="2rem 0" />
                <FollowerListWidget userId={userId} />
              </>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
