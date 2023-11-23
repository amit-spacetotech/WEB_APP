import React from "react";
import dynamic from "next/dynamic";

const Login = dynamic(() => import("../../components/auth/login"), {
  ssr: false,
});

function Index() {
  return <Login responsive login={true} />;
}

export default Index;
