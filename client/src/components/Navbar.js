import React, { useState } from "react";
import SportsCricketIcon from "@mui/icons-material/SportsCricket";
import { useDispatch, useSelector } from "react-redux";
import { selectedCategory } from "../features/category";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "@mui/material";
import Chip from "@mui/material/Chip";
import HomeIcon from "@mui/icons-material/Home";
import DiamondIcon from '@mui/icons-material/Diamond';
import "./navbar.css";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobileScreens = useMediaQuery("(min-width: 1200px)");
  const categorySelected = useSelector((state) => state.category.value);

  const handleCategoryClick = (category) => {
    dispatch(selectedCategory(category));
    navigate("/explore");
  };

  const [isOpen, setIsOpen] = useState(false);

  const handleButtonClick = () => {
    setIsOpen((prevIsOpen) => !prevIsOpen);
  };

  const handleListMouseLeave = () => {
    setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  return (
    <>
      {isNonMobileScreens ? (
        <nav className="main-menu">
          <ul>
            <li
              onClick={() => handleCategoryClick("explore")}
              className={categorySelected === "explore" ? "selected" : ""}
            >
              <a href="/explore">
                <i className="fa fa-home fa-2x"></i>
                <span className="nav-text">Explore</span>
              </a>
            </li>
            <li
              className={`has-subnav ${categorySelected === "Politics" ? "selected" : ""}`}
              onClick={() => handleCategoryClick("Politics")}
            >
              <a>
                <i className="fa fa-globe fa-2x"></i>
                <span className="nav-text">Politics</span>
              </a>
            </li>
            <li
              className={`has-subnav ${categorySelected === "Science" ? "selected" : ""}`}
              onClick={() => handleCategoryClick("Science")}
            >
              <a>
                <i className="fa fa-flask fa-2x"></i>
                <span className="nav-text">Science and Technology</span>
              </a>
            </li>
            <li
              className={`has-subnav ${categorySelected === "Culture" ? "selected" : ""}`}
              onClick={() => handleCategoryClick("Culture")}
            >
              <a>
                <i className="fa fa-camera-retro fa-2x"></i>
                <span className="nav-text">Culture</span>
              </a>
            </li>
            <li
              className={`has-subnav ${categorySelected === "Business" ? "selected" : ""}`}
              onClick={() => handleCategoryClick("Business")}
            >
              <a>
                <i className="fa fa-camera-retro fa-2x"></i>
                <span className="nav-text">Business</span>
              </a>
            </li>
            <li
              onClick={() => handleCategoryClick("Sports")}
              className={categorySelected === "Sports" ? "selected" : ""}
            >
              <a>
                <SportsCricketIcon style={{ width: "60px" }} className="fa" />
                <span style={{ verticalAlign: "top" }} className="nav-text">
                  Sports
                </span>
              </a>
            </li>
            <li
              onClick={() => handleCategoryClick("Others")}
              className={categorySelected === "Others" ? "selected" : ""}
            >
              <a>
                <DiamondIcon style={{ width: "60px" }} className="fa" />
                <span style={{ verticalAlign: "top" }} className="nav-text">
                  Others
                </span>
              </a>
            </li>
          </ul>
        </nav>
      ) : (
        <div className="mobile-nav">
          <Chip
            className="chip-home"
            label="Explore"
            style={{
              width: "40%",
              alignSelf: "center",
              color: "white",
              cursor: "pointer",
            }}
            variant="outlined"
            color="secondary"
            icon={<HomeIcon />}
            onClick={() => handleCategoryClick("explore")}
          />
          <div className="m-dropdown">
            <div
              className={`e-button ${isOpen ? "open" : ""}`}
              onClick={handleButtonClick}
            >
              {categorySelected == "explore" ? "Category" : categorySelected}
              <div className="e-burger">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
            {isOpen && (
              <ul className="e-list" onMouseLeave={handleListMouseLeave}>
                <li onClick={() => handleCategoryClick("Politics")}>
                  <a>Politics</a>
                </li>
                <li onClick={() => handleCategoryClick("Science")}>
                  <a>Science and Technology</a>
                </li>
                <li onClick={() => handleCategoryClick("Culture")}>
                  <a>Culture</a>
                </li>
                <li onClick={() => handleCategoryClick("Sports")}>
                  <a>Sports</a>
                </li>
                <li onClick={() => handleCategoryClick("Business")}>
                  <a>Business</a>
                </li>
                <li onClick={() => handleCategoryClick("Others")}>
                  <a>Others</a>
                </li>
              </ul>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
