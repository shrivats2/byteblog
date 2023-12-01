import React from "react";
import { styled } from "@mui/system";
import { Container, Typography, Link, Grid } from "@mui/material";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";
import RedditIcon from "@mui/icons-material/Reddit";

const FooterContainer = styled("footer")({
  backgroundColor: "#1976D2",
  padding: "32px 0",
  color: "white",
});

const StyledLink = styled(Link)({
  color: "white",
  textDecoration: "none",
  "&:hover": {
    textDecoration: "underline",
  },
});

const IconContainer = styled("div")({
  display: "flex",
  alignItems: "center",
  marginTop: "10px",
});

const SocialIcon = styled("div")({
  marginRight: "10px",
});

const Footer = () => {
  return (
    <FooterContainer>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              About Us
            </Typography>
            <Typography>
              ByteBlog: Seamless blogging, vibrant content, effortless joy. Join
              us!
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Links
            </Typography>
            <StyledLink href="/">Home</StyledLink>
            <br />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Contact
            </Typography>
            <Typography>Email: admin@byteblog.com</Typography>
            <Typography>Phone: +1 (123) 456-7890</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Follow Us
            </Typography>
            <IconContainer>
              <SocialIcon>
                <LinkedInIcon
                  style={{
                    fontSize: 30,
                    background: "blue",
                    display: "flex",
                    alignItems: "center",
                  }}
                />
              </SocialIcon>
              <SocialIcon>
                <TwitterIcon
                  style={{
                    fontSize: 30,
                    background: "black",
                    display: "flex",
                    alignItems: "center",
                  }}
                />
              </SocialIcon>
              <SocialIcon>
                <RedditIcon
                  style={{
                    fontSize: 30,
                    background: "#ff7300",
                    display: "flex",
                    alignItems: "center",
                  }}
                />
              </SocialIcon>
            </IconContainer>
          </Grid>
        </Grid>
        <Typography
          variant="subtitle1"
          align="center"
          style={{ marginTop: "20px" }}
        >
          © {new Date().getFullYear()} ByteBlog. All rights reserved.
        </Typography>
      </Container>
    </FooterContainer>
  );
};

export default Footer;