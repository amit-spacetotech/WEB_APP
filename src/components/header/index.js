import Image from "next/image";
import { useRouter } from "next/router";
import React, { useState } from "react";
import Login from "../auth/login";
import SignUp from "../auth/signup";
import CommonModal from "../common/modal";
import styles from "./header.module.css";
import { FaRegUserCircle } from "react-icons/fa";
import Badge from "react-bootstrap/Badge";
import Logo from "../../assets/logo.png";
import { auth, provider, fbProvider } from "../../config/config";
import { connect } from "react-redux";
import {
  getHouseMates,
  getTotalMessageCount,
  getUser,
} from "@/redux/actions/auth";
import Overlay from "react-bootstrap/Overlay";
import Popover from "react-bootstrap/Popover";
import NavDrawer from "./Drawer";
import { useMediaQuery } from "react-responsive";
import CreateHome from "../../views/web/CreateHome/createHome";
import { CiSettings } from "react-icons/ci";
import { MdLogout } from "react-icons/md";
import CreateProfile from "@/views/web/CreateProfile/createProfile";
import ForgotPassword from "../auth/forgotPassword";
function Header(props) {
  const router = useRouter();
  const [step, setStep] = React.useState(0);
  const [showPopover, setShowPopover] = useState(false);
  const [openProfileModal, setProfileModal] = React.useState(false);
  const target = React.useRef(null);
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 700px)" });
  const [authentication, setAuthenticatoin] = useState({
    login: false,
    otp: false,
    signup: false,
    forgot: false,
  });
  const [openHome, setOpenHome] = React.useState(false);
  const [openLog, setOpenLog] = React.useState(false);
  const signOut = () => {
    localStorage.removeItem("token");
    window.location.replace("/");
  };
  const firebaseSignOut = () => {
    auth.signOut().then(
      function () {
        signOut();
      },
      function (error) {
        console.error("Sign Out Error", error);
      }
    );
  };

  React.useEffect(() => {
    if (props.auth && props.auth.user && !props.auth.messageCount) {
      props.getTotalMessageCount(props.auth.user._id);
    }
  }, [props.auth.user]);
  const handleMyAccountClick = () => {
    setShowPopover(!showPopover);
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <CommonModal
          className="auth"
          show={authentication.login}
          setShow={() => setAuthenticatoin({ login: false, signup: false })}
          bodyContent={
            <Login
              responsive={props.responsive}
              setAuth={setAuthenticatoin}
              auth={authentication}
              setToken={null}
              provider={provider}
            />
          }
        />
        <CommonModal
          className="auth"
          show={openLog}
          size="lg"
          setShow={() => setOpenLog(false)}
          bodyContent={
            <div className={styles.logoutContainer}>
              <h2>
                Are you sure you want to <br /> sign out?
              </h2>
              <div className={styles.button}>
                <button
                  className={styles.yesLog}
                  onClick={() =>
                    props.auth.user &&
                    props.auth.user.verificationType === "EMAIL"
                      ? signOut()
                      : firebaseSignOut()
                  }
                >
                  Yes
                </button>
                <button
                  className={styles.noLog}
                  onClick={() => setOpenLog(false)}
                >
                  No
                </button>
              </div>
            </div>
          }
        />
        <CommonModal
          className="auth"
          show={authentication.forgot}
          setShow={() =>
            setAuthenticatoin({ login: false, signup: false, forgot: false })
          }
          bodyContent={
            <ForgotPassword
              responsive={props.responsive}
              setAuth={setAuthenticatoin}
              auth={authentication}
              setToken={null}
              provider={provider}
            />
          }
        />
        <CommonModal
          className="userProfile"
          size="lg"
          hideCross={step === 7 ? false : true}
          step={step}
          getUser={props.getUser}
          show={openProfileModal}
          setShow={() => {
            setProfileModal(false);
          }}
          bodyContent={<CreateProfile setStep={setStep} step={step} />}
        />
        <CommonModal
          className="auth"
          show={authentication.signup}
          setShow={() => setAuthenticatoin({ login: false, signup: false })}
          bodyContent={
            <SignUp
              setAuth={setAuthenticatoin}
              auth={authentication}
              responsive={props.responsive}
              provider={provider}
            />
          }
        />
        <CommonModal
          className="userProfile"
          size="lg"
          show={openHome}
          setShow={() => {
            setOpenHome(false);
          }}
          bodyContent={<CreateHome setOpenHome={setOpenHome} />}
        />

        {/* <h4 style={{width:"100%",marginBottom:0}} >Home Share</h4> */}
        <Image
          onClick={() => {
            props.getHouseMates(
              1,
              9,
              "",
              props.auth && props.auth.user && props.auth.user._id
            );
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
          width="120"
          style={{ cursor: "pointer" }}
          src={Logo}
        />
        {isTabletOrMobile && (
          <NavDrawer auth={props.auth.user} signOut={signOut} />
        )}

        {/* {((router.pathname === "/favourites" && !props.auth.user.userProfile) ||
          (router.pathname === "/guestuser" && !router.query.location) || */}
        {props.auth.user && props.auth.user !== "NO_USER" && (
          <div className={styles.subAllList}>
            <p
              onClick={() => {
                if (
                  router.pathname === "/guestuser" ||
                  !props.auth.user.userProfile
                ) {
                  setProfileModal(true);
                  return;
                }
                router.push("/profile");
              }}
              className={router.asPath === "/profile" && styles.active}
            >
              My Profile
            </p>
            <p
              className={router.asPath === "/property" && styles.active}
              onClick={() => {
                if (
                  router.pathname === "/guestuser" ||
                  !props.auth.user.userProfile
                ) {
                  alert("Please create your profile first");
                  return;
                }
                props.auth.user && !props.auth.userProperty
                  ? setOpenHome(true)
                  : router.push("/property");
              }}
            >
              My Home
            </p>
            <p
              onClick={() => {
                if (
                  router.pathname === "/guestuser" ||
                  !props.auth.user.userProfile
                ) {
                  alert("Please create your profile first");
                  return;
                }
                router.push("/messages");
              }}
            >
              My Messages
              <Badge
                style={{
                  borderRadius: "50%",
                  top: "10px",
                  position: "absolute",
                }}
                bg="warning"
              >
                {props.auth && props.auth.messageCount
                  ? props.auth.messageCount
                  : 0}
              </Badge>{" "}
            </p>
            <p
              onClick={() => router.push("/favourites")}
              className={router.asPath === "/favourites" && styles.active}
            >
              Favorites
            </p>
            <div ref={target}>
              <span
                className={`${styles.myAccountLink} ${
                  router.asPath === "/settings" && styles.active
                }`}
                onClick={handleMyAccountClick}
              >
                <FaRegUserCircle style={{ marginRight: "7px" }} />
                My Account
              </span>
            </div>
            <Overlay
              show={showPopover}
              target={target.current}
              placement="bottom"
              rootClose={true}
              onHide={() => setShowPopover(false)}
            >
              <Popover id="popover-my-account">
                <Popover.Body className={styles.popOverBody}>
                  <p
                    onClick={() => {
                      router.push("/settings");
                      setShowPopover(false);
                    }}
                  >
                    <CiSettings />
                    Settings
                  </p>
                  <p
                    onClick={() => {
                      setOpenLog(true);
                    }}
                  >
                    <MdLogout />
                    Sign out
                  </p>
                </Popover.Body>
              </Popover>
            </Overlay>
          </div>
        )}

        {(!props.auth.user || props.auth.user === "NO_USER") && (
          // (props.auth.user && !props.auth.user.userProfile)) &&
          // !(
          //   router.pathname === "/favourites" && !props.auth.user.userProfile
          // ) &&
          // (router.pathname !== "/guestuser" ||
          //   (router.pathname === "/guestuser" && router.query.location)) && (
          <div className={styles.subList}>
            <p
              onClick={() => {
                if (router.query.location) {
                  router.push(`/aboutus?location=${router.query.location}`);
                  return;
                }
                router.push("/aboutus");
              }}
              className={
                router.asPath === "/aboutus" &&
                !authentication.login &&
                !authentication.signup &&
                styles.active
              }
            >
              Our Story
            </p>
            <p
              onClick={() => {
                if (router.query.location) {
                  router.push(`/blog?location=${router.query.location}`);
                  return;
                }
                router.push("/blog");
              }}
              className={
                router.asPath === "/blog" &&
                !authentication.login &&
                !authentication.signup &&
                styles.active
              }
            >
              Blog
            </p>
            <p
              className={authentication.login && styles.active}
              onClick={() =>
                setAuthenticatoin({ ...authentication, login: true })
              }
            >
              Login
            </p>
            <p
              className={authentication.signup && styles.active}
              onClick={() =>
                setAuthenticatoin({ ...authentication, signup: true })
              }
            >
              Sign Up
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
  };
};

export default connect(mapStateToProps, {
  getUser,
  getHouseMates,
  getTotalMessageCount,
})(Header);
