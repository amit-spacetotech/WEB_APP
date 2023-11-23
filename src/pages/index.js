import HomePage from "@/views/web/HomePage";
import { connect } from "react-redux";
import React, { useEffect } from "react";
import AppLoader from "@/utils/AppLoader/AppLoader";
import dynamic from "next/dynamic";
import { useMediaQuery } from "react-responsive";
import { useRouter } from "next/router";

const LandingPage = dynamic(() => import("@/views/web/landing"), {
  ssr: false,
});
const LandingRes = dynamic(() => import("@/views/responsive/LandingPage"), {
  ssr: false,
});

function Home(props) {
  const router = useRouter();
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 600px)" });

  useEffect(() => {
    if (isTabletOrMobile) {
      if (
        props.auth.user &&
        props.auth.user !== "NO_USER" &&
        !props.auth.user.userProfile
      ) {
        router.push("/createaccount");
      }
    }
  });
  return (
    <>
      
      {!props.auth.user && <AppLoader />}
      {(props.auth.user === "NO_USER" ||
        (props.auth.user && !props.auth.user.userProfile)) &&
        !isTabletOrMobile && <LandingPage />}
      {props.auth.user === "NO_USER" && isTabletOrMobile && (
        <LandingRes props={props} />
      )}
      {props.auth.user !== "NO_USER" &&
        props.auth.user &&
        props.auth.user.userProfile && <HomePage />}
    </>
  );
}
const mapStateToProps = (state) => ({
  auth: state.auth,
});
export default connect(mapStateToProps, null)(Home);
