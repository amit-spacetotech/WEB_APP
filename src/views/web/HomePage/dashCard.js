import React from "react";
import styles from "./home.module.css";
import {
  MdLocationOn,
  MdFavorite,
  MdVerifiedUser,
  MdOutlineFavoriteBorder,
} from "react-icons/md";
import { FaMoneyBillAlt } from "react-icons/fa";
import { useRouter } from "next/router";
import DummyImg from "../../../assets/check.png";
import homeSvg from "../../../assets/HomePage/house.svg";
function DashCard(props) {
  const router = useRouter();
  function checkUserProfileIdExists() {
    return (
      props.favoritesList &&
      props.favoritesList.some((obj) => obj.userProfileId === props._id)
    );
  }
  function checkUserHomeIdExists() {
    return (
      props.favoritesList &&
      props.favoritesList.some((obj) => obj.homeId === props._id)
    );
  }

  const checkAge = () => {
    const dateOfBirthString = props.dob;
    const dateOfBirth = new Date(dateOfBirthString);
    const today = new Date();

    let age = today.getFullYear() - dateOfBirth.getFullYear();
    const monthDiff = today.getMonth() - dateOfBirth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())
    ) {
      age--;
    }
    return isNaN(age) ? 0 : age;
  };

  return (
    <div
      className={styles.card}
      // onClick={() => {
      //   if (mates) {
      //     router.push("/owner");
      //   }
      //   router.push("/property");
      // }}
    >
      <img
        src={props.image ? props.image : DummyImg.src}
        alt="image"
        className={styles.thumbnail}
        onClick={() => {
          !props.guest && props.userProfileCheck
            ? props.showSecurity
              ? router.push(`/mates?_id=${props._id}`)
              : router.push(`/matehome?_id=${props._id}`)
            : alert(
                props.guest || !props.loginedUser
                  ? "Please login to check complete information"
                  : "Please create your profile first"
              );
        }}
      />

      <div
        className={
          checkUserProfileIdExists() || checkUserHomeIdExists()
            ? styles.activeFavorite
            : styles.favoriteBg
        }
      >
        {checkUserProfileIdExists() || checkUserHomeIdExists() ? (
          <MdFavorite
            color="#FF3A3A"
            onClick={() => props.deleteFavorite(props._id)}
          />
        ) : (
          <MdOutlineFavoriteBorder
            onClick={() => {
              if (!props.loginedUser) {
                alert("Please login");
                return;
              } else {
                props.addFavorite(props._id);
              }
            }}
          />
        )}
      </div>
      {props.haveHome && (
        <div className={styles.homeOverlay}>
          <img src={homeSvg.src} alt="HomeIcon" />
        </div>
      )}
      <div className="d-flex mt-1">
        <div style={{ width: "100%" }}>
          <div className="d-flex justify-content-between m-1">
            <div className={`d-flex ${styles.leftDiv}`}>
              {!props.showSecurity && (
                <img src={props.userImg} alt="..." className={styles.userImg} />
              )}{" "}
              <div className={styles.flexDirection}>
                <h3 className="fs-10 mb-0 fw-bolder d-flex align-center">
                  {props.firstName ? props.firstName : "N/A"}
                  {!props.showSecurity && "'s home"}
                  {props.showSecurity && ", "}
                  {props.showSecurity && checkAge()}{" "}
                  {props.showSecurity && (
                    <MdVerifiedUser
                      color="#3BD600"
                      style={{ marginLeft: "0.3rem" }}
                    />
                  )}
                </h3>
                <p className={`fs-10 mb-0 ${styles.location}`}>
                  {" "}
                  <span>
                    <MdLocationOn color="#00BED4" fontSize="1.3rem" />
                  </span>{" "}
                  {props.location ? props.location : "N/A"}
                </p>
              </div>
            </div>

            <p className="fs-10 mb-0">
              <span style={{ margin: "0 3px" }}>
                R
                {/* <FaMoneyBillAlt
                  color="#3ca244"
                  style={{ width: "22px", height: "22px" }}
                /> */}
              </span>
              {props.rent ? props.rent : 0}
              /month
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashCard;
