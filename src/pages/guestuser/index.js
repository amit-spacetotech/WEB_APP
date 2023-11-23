import HomePage from "@/views/web/HomePage";
import { connect } from "react-redux";
import React, { useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { useRouter } from "next/router";

function Guest(props) {
  return (
    <>
      <HomePage />
    </>
  );
}
const mapStateToProps = (state) => ({
  auth: state.auth,
});
export default connect(mapStateToProps, null)(Guest);
