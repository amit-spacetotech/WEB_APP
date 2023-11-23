import React from "react";
import dynamic from "next/dynamic";
const Blog = dynamic(() => import("@/views/web/Blog"), { ssr: false });

function Index() {
  return <Blog />;
}

export default Index;
