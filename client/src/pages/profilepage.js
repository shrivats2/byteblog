import { Box, useMediaQuery } from "@mui/material";
import { useParams } from "react-router-dom";
import Header from "../Header";
import UserWidget from "../components/UserWidget";
import FollowerListWidget from "../components/FollowerListWidget";
import ProfilePost from "./profileposts";

const ProfilePage = () => {
  const { userId } = useParams();
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");

  return (
    <Box>
      <Header />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="2rem"
        justifyContent="center"
      >
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          <UserWidget userId={userId} />
          <Box m="2rem 0" />
          <FollowerListWidget userId={userId} />
        </Box>
        <Box
          display="flex"
          flexBasis={isNonMobileScreens ? "72%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
          sx={{ flexFlow: "wrap" }}
          gap="3rem"
        >
          <ProfilePost userId={userId} />
        </Box>
      </Box>
    </Box>
  );
};

export default ProfilePage;
