import { useRouter } from "next/router";
import React from "react";
import styles from "./footer.module.css";
import fbImg from "../../assets/landing/facebook.svg";
import instagramImg from "../../assets/landing/linkedin.svg";
import Image from "next/image";
import CheckMobileScreen from "@/utils/checkMobileScreen";

function Footer({ responsive }) {
  let isMobile = CheckMobileScreen();
  const token = localStorage.getItem("token");

  const router = useRouter();

  return (
    <footer className={styles.container}>
      <div className={styles.contentFirst}>
        <p onClick={() => router.push("/privacy")}>Privacy & Terms</p>
        <p className={styles.midLine}>|</p>
        <p onClick={() => router.push("/pricing")}>Pricing</p>
        {isMobile && (
          <>
            {" "}
            <p className={styles.midLine}>|</p>
            <p onClick={() => router.push("/blog")}>Blog</p>
          </>
        )}
        <p className={styles.midLine}>|</p>

        <p onClick={() => router.push(isMobile ? "/contact" : "/aboutus")}>
          {" "}
          {isMobile ? "Contact Us" : "About us"}
        </p>
        {!isMobile && token !== null && (
          <>
            {" "}
            <p className={styles.midLine}>|</p>
            <p onClick={() => router.push("/blog")}>Blog</p>
          </>
        )}

        <p className={styles.midLine}>|</p>
        <p onClick={() => router.push(isMobile ? "/aboutus" : "/contact")}>
          {isMobile ? "About us" : "Contact Us"}
        </p>
      </div>
      <div className={styles.contentSecond}>
        <Image
          src={fbImg.src}
          alt="Fb"
          width="23"
          height="23"
          onClick={() =>
            window.open("https://www.facebook.com/2HomeShare", "_blank")
          }
        />
        <Image
          src={instagramImg.src}
          alt="Fb"
          width="22"
          height="23"
          onClick={() =>
            window.open("https://www.linkedin.com/company/2homeshare", "_blank")
          }
        />
      </div>

      <p className={styles.copyRight}>
        COPYRIGHT © 2023 HOME SHARE ALL RIGHTS RESERVED
      </p>

      {/* responsive footer=============== */}
      <div className={styles.responsive}>
        <div className={styles.social}>
          <Image src={fbImg.src} alt="Fb" width="15" height="23" />
          <Image src={instagramImg.src} alt="Fb" width="23" height="23" />
        </div>
        <div className={styles.copyRightDiv}>
          <p className={styles.copyRightResponsive}>
            COPYRIGHT © 2023 HOME SHARE ALL RIGHTS RESERVED
          </p>
        </div>
      </div>
      {/* responsive footer=============== */}
    </footer>
  );
}

export default Footer;

// const mapStateToProps = (state) => {
//   return {
//     auth: state.auth,
//   };
// };

// export default connect(mapStateToProps, { getUser })(Footer);
