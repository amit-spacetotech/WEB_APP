import React from "react";
import dynamic from "next/dynamic";

const Mates = dynamic(() => import("../../views/web/Profile/index"), {
  ssr: false,
});

function index() {
  return <Mates />;
}

export default index;
