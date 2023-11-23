import React from "react";
import styles from "./styles.module.css";
import home from "../../assets/HomePage/navhome.svg";
import search from "../../assets/HomePage/navsearch.svg";
import msg from "../../assets/HomePage/navmsg.svg";
import heart from "../../assets/HomePage/navheart.svg";
import acc from "../../assets/HomePage/navacc.svg";
import { useRouter } from "next/router";
import CommonModal from "../common/modal";
import CreateHome from "../../views/responsive/CreateHome/index";
import { connect } from "react-redux";
const NavFooter = (props) => {
  const router = useRouter();
  const [openHome, setOpenHome] = React.useState(false);
  const [stepNo, setStepNo] = React.useState(0);

  return (
    <div className={styles.mainContainer}>
      <CommonModal
        className={
          stepNo != 0 && stepNo != 7 ? "userHomeMobile" : "userProfile"
        }
        size="lg"
        show={openHome}
        hide={stepNo != 0 && stepNo != 7}
        setShow={() => {
          setOpenHome(false);
          setStepNo(0);
        }}
        bodyContent={
          <CreateHome setStepNo={setStepNo} setOpenHome={setOpenHome} />
        }
      />
      <div
        onClick={() => {
          if (
            props.auth.user &&
            props.auth.user !== "NO_USER" &&
            !props.auth.user.userProfile &&
            !router.query.location
          ) {
            router.push("/guestuser");
          }
          if (!props.auth?.user?.userProfile && router.query.location) {
            router.push(`/guestuser?location=${router.query.location}`);
          }
          if (
            router.pathname === "/guestuser" ||
            (props.auth.user &&
              props.auth.user !== "NO_USER" &&
              !props.auth?.user?.userProfile)
          ) {
            return;
          }
          router.push("/");
        }}
        className={`${styles.content} ${
          (router.asPath === "/" || router.pathname === "/guestuser") &&
          styles.active
        }`}
      >
        <img src={search.src} alt="" />
        <p>Explore</p>
      </div>
      <div
        onClick={() => {
          if (!props.userProfile) {
            router.push("/createaccount");
            return;
          }
          router.push("/profile");
        }}
        className={`${styles.content} ${
          router.asPath === "/profile" && styles.active
        }`}
      >
        <img src={acc.src} alt="" />
        <p>My Profile</p>
      </div>
      <div
        onClick={() => {
          if (!props.userProfile) {
            alert("Please create your profile");
            return;
          }
          props.auth.userProperty
            ? router.push("/property")
            : setOpenHome(true);
        }}
        className={`${styles.content} ${
          router.asPath === "/property" && styles.active
        }`}
      >
        <img src={home.src} alt="" />
        <p>My Home</p>
      </div>
      <div
        onClick={() => {
          if (!props.userProfile) {
            alert("Please create your profile");
            return;
          }
          router.push("/messages");
        }}
        className={`${styles.content} ${
          router.asPath === "/messages" && styles.active
        }`}
      >
        <img src={msg.src} alt="" />
        <p>Messages</p>
      </div>
      <div
        onClick={() => router.push("/favourites")}
        className={`${styles.content} ${
          router.asPath === "/favourites" && styles.active
        }`}
      >
        <img src={heart.src} alt="" />
        <p>Favorites</p>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    userProfile: state.auth.user.userProfile,
  };
};

export default connect(mapStateToProps, null)(NavFooter);
