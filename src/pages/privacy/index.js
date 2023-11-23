import React from "react";
import dynamic from "next/dynamic";
import { useMediaQuery } from "react-responsive";
const Privacy = dynamic(() => import("@/views/web/Privacy"), { ssr: false });
const PricingRes = dynamic(() => import("@/views/responsive/Privacy"), {
  ssr: false,
});

function Index() {
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });

  return !isTabletOrMobile ? <Privacy /> : <PricingRes />;
}

export default Index;
