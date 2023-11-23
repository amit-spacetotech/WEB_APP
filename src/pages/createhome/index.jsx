import React from "react";
import dynamic from "next/dynamic";

const Createhome = dynamic(
  () => import("../../views/responsive/CreateHome/index"),
  { ssr: false }
);

function index() {
  return <Createhome responsive login={true} />;
}

export default index;
