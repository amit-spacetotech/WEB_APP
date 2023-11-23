import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useMediaQuery } from "react-responsive";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { useGlobalStore } from "@/utils/store";
import { connect } from "react-redux";
import GoogleAnalytics from "../components/GoogleAnalytics";
const ProfileImg = dynamic(() => import("@/components/common/profile"), {
  ssr: false,
});
const Header = dynamic(() => import("@/components/header"), { ssr: false });
const Footer = dynamic(() => import("@/components/footer"), { ssr: false });
const NavFooter = dynamic(
  () => import("@/components/NavigationFooter/NavFooter"),
  { ssr: false }
);

const Layout = ({ children, ...props }) => {
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 600px)" });
  const token = typeof window !== "undefined" && localStorage.getItem("token");
  const router = useRouter();
  const { profileImg, setProfileImg } = useGlobalStore((state) => state);

  return (
    <div style={{ minHeight: "100vh" }}>
      <GoogleAnalytics />
      {profileImg && <ProfileImg />}
      {router.pathname == "/login" ||
      router.pathname == "/forgotPassword" ||
      router.pathname == "/signup" ||
      router.pathname == "/createaccount" ||
      router.pathname == "/createhome" ? null : (
        <Header responsive={isTabletOrMobile} />
      )}

      <div className="main-content">{children}</div>
      {((router.pathname == "/" && props.user && props.user !== "NO_USER") ||
        router.pathname == "/favourites" ||
        // router.pathname == "/chat" ||
        router.pathname == "/messages" ||
        router.pathname === "/guestuser" ||
        router.pathname == "/property" ||
        router.pathname == "/matehome" ||
        router.pathname == "/profile") && <NavFooter />}

      {((router.pathname == "/" &&
        !isTabletOrMobile &&
        props.user &&
        props.user !== "NO_USER") ||
        (router.pathname == "/profile" && !isTabletOrMobile) ||
        (router.pathname == "/property" && !isTabletOrMobile) ||
        (router.pathname === "/guestuser" && !isTabletOrMobile) ||
        // (router.pathname == "/chat" && !isTabletOrMobile) ||
        (router.pathname == "/matehome" && !isTabletOrMobile) ||
        (router.pathname == "/messages" && !isTabletOrMobile) ||
        (router.pathname == "/favourites" && !isTabletOrMobile)) && (
        <Footer responsive={isTabletOrMobile} />
      )}

      {router.pathname == "/login" ||
      router.pathname == "/signup" ||
      router.pathname == "/createaccount" ||
      router.pathname == "/chat" ||
      router.pathname === "/guestuser" ||
      router.pathname == "/matehome" ||
      router.pathname == "/messages" ||
      (router.pathname == "/" && props.user && props.user !== "NO_USER") ||
      router.pathname == "/favourites" ||
      router.pathname == "/property" ||
      router.pathname == "/profile" ||
      router.pathname == "/createhome" ? null : (
        <Footer responsive={isTabletOrMobile} />
      )}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
  };
};

export default connect(mapStateToProps, null)(Layout);
