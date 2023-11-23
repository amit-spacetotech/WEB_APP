import React, { useState } from "react";
import styles from "./styles.module.css";
import DashCard from "./Dashcard";
import { IoIosArrowBack } from "react-icons/io";
import { useRouter } from "next/router";
import { getFavoritesList } from "@/redux/actions/contentAction";
import { connect } from "react-redux";
import Lottie from "react-lottie";
import { Pagination } from "react-bootstrap";
import emptBox from "../../assets/favorites/629.json";
import AppLoader from "@/utils/AppLoader/AppLoader";
import DummyImg from "../../assets/check.png";
import { checkAge } from "@/utils/checkAge";
import axios from "axios";
import { useMediaQuery } from "react-responsive";
import { getFavorites } from "@/redux/actions/auth";
const Favorites = (props) => {
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 600px)" });
  const [currentPage, setCurrentPage] = React.useState(1);
  const router = useRouter();
  React.useEffect(() => {
    props.getFavoritesList(1, 9);
  }, []);

  const handleClick = (pageNumber) => {
    props.getFavoritesList(pageNumber, 9);
    setCurrentPage(pageNumber);
  };

  const generatePageNumbers = (totalPage) => {
    let pageNumbers = [];

    for (let i = 1; i <= totalPage; i++) {
      pageNumbers.push(
        <Pagination.Item
          key={i}
          active={i === currentPage}
          onClick={() => handleClick(i)}
          activeclassname={styles.activePage}
        >
          {i}
        </Pagination.Item>
      );
    }

    return pageNumbers;
  };

  const deleteFavorite = (obj) => {
    axios({
      method: "delete",
      url: `/favorites/removeFavorite`,
      basic: true,
      headers: {
        "Content-Type": "Application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      data: obj,
    })
      .then((res) => {
        alert("Favorite removed successfully");
        props.getFavorites("home");
        props.getFavorites("userProfile");
        props.getFavoritesList(1, 9);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const defaultOptions1 = {
    loop: true,
    autoplay: true,
    animationData: emptBox,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <div className={styles.container}>
      {props.favorites && props.favorites.length < 1 && isTabletOrMobile && (
        <div className={styles.mobileBack}>
          <IoIosArrowBack
            fontSize="1.25rem"
            cursor="pointer"
            onClick={() => router.push("/")}
          />
        </div>
      )}
      {!props.favorites && <AppLoader />}
      {props.favorites && props.favorites.length < 1 && (
        <div className={styles.emptyContent}>
          <Lottie
            options={defaultOptions1}
            height={isTabletOrMobile ? 160 : 300}
            width={isTabletOrMobile ? 160 : 300}
          />
          <p>You have no favorites yet!</p>
          <button onClick={() => router.push("/")}>Click here to add</button>
        </div>
      )}
      {props.favorites && props.favorites.length > 0 && (
        <>
          <span className={styles.fev}>
            {" "}
            <IoIosArrowBack
              fontSize="1.25rem"
              cursor="pointer"
              onClick={() => router.push("/")}
            />{" "}
            <h4> Favorites</h4>
          </span>
          <div className={styles.cardContainer}>
            {props.favorites.map((v, i) => {
              return (
                <DashCard
                  _id={v.userProfileId ? v.userProfileId._id : v.homeId._id}
                  favoritesList={props.favorites}
                  deleteFavorite={deleteFavorite}
                  checkUserProfile={v.userProfileId ? true : false}
                  image={
                    v.userProfileId && v.userProfileId.images.length > 0
                      ? v.userProfileId.images[0]
                      : v.homeId
                      ? v.homeId.images.length > 0 && v.homeId.images[0]
                      : DummyImg
                  }
                  dob={v.userProfileId.dob}
                  firstName={v.firstName}
                  rent={v.rentalBudget}
                  haveProfile={props.auth.userProfile ? true : false}
                  location={v.location}
                  showSecurity={true}
                  key={i}
                />
              );
            })}
          </div>
          {props.favoriteMeta?.totalPage > 1 && (
            <Pagination className={styles.pagination}>
              <Pagination.Prev
                disabled={currentPage === 1}
                onClick={() => handleClick(currentPage - 1)}
              />
              {generatePageNumbers(props.favoriteMeta?.totalPage)}
              <Pagination.Next
                disabled={currentPage === props.favoriteMeta?.totalPage}
                onClick={() => handleClick(currentPage + 1)}
              />
            </Pagination>
          )}
        </>
      )}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    auth: state.auth.user,
    favorites: state.content.favorites,
    favoriteMeta: state.content.favoriteMeta,
  };
};

export default connect(mapStateToProps, { getFavoritesList, getFavorites })(
  Favorites
);
