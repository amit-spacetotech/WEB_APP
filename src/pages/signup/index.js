import React from "react";
import dynamic from "next/dynamic";

const SignUp = dynamic(() => import("@/components/auth/signup"), {
  ssr: false,
});

function Index() {
  return <SignUp responsive signUp={true} />;
}

export default Index;
