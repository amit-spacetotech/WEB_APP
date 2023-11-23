import React from "react";
import dynamic from "next/dynamic";
import { useMediaQuery } from "react-responsive";

const UserChat = dynamic(
  () => import("../../views/responsive/Messages/UserChat"),
  {
    ssr: false,
  }
);

function index() {
  return <UserChat />;
}

export default index;
