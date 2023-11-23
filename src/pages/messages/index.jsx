import React from "react";
import dynamic from "next/dynamic";
import { useMediaQuery } from "react-responsive";

const Messages = dynamic(() => import("../../views/web/Messages/messages"), {
  ssr: false,
});
const MobileMessages = dynamic(
  () => import("../../views/responsive/Messages/Messages"),
  {
    ssr: false,
  }
);
function index() {
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 600px)" });
  return isTabletOrMobile ? <MobileMessages /> : <Messages />;
}

export default index;
