import { useRouter } from "next/router";
import React from "react";
import styles from "./footer.module.css";

function FooterResp() {
  const router = useRouter();

  return (
    <div className={styles.containerRes}>
      <div className={styles.contentFirstRes}>
        <p onClick={() => router.push("/privacy")}>Privacy & Terms</p>
        <p onClick={() => router.push("/pricing")}>Pricing</p>
        <p onClick={() => router.push("/blog")}>Blog</p>
        <p onClick={() => router.push("/aboutus")}> About Us</p>
        <p onClick={() => router.push("/contact")}> Contact Us</p>
      </div>

      <hr />
      <div className={styles.contentSecondRes}>
        <div className={styles.innerContentRes}>
          <p className="mb-0">fb</p>
          <p className="mb-0">ins</p>
        </div>
        <p style={{ fontSize: "10px", width: "60%", textAlign: "end" }}>
          COPYRIGHT © 2023 HOME SHARE ALL RIGHTS RESERVED
        </p>
      </div>
    </div>
  );
}

export default FooterResp;
