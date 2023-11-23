// components/GoogleAnalytics.js
import { useEffect } from "react";

export default function GoogleAnalytics() {
  useEffect(() => {
    // Your Google Analytics gtag.js code here
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    gtag("js", new Date());
    gtag("config", "G-CRSVVP0P7M");
  }, []);

  return null;
}
