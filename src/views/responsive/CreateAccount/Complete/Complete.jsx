import React from "react";
import createProfile_end from "../../../../assets/createProfile/createProfile_end.json";

import styles from "./complete.module.css";
import Lottie from "react-lottie";
import { useRouter } from "next/router";
import { GrFormClose } from "react-icons/gr";
const Complete = () => {
  const router = useRouter();
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: createProfile_end,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <div className={styles.page}>
      <div className={`${styles.profileComp} ${styles.end}`}>
        <GrFormClose
          className={styles.svg}
          onClick={() => {
            window.location.replace("/");
          }}
        />
        <Lottie options={defaultOptions} height={200} width={200} />
        <h2 style={{ fontSize: "18px" }}>Profile created successful!</h2>
        <p style={{ fontSize: "12px" }}>
          Your profile has been successfully created!
          <br /> You can now interact with other users.
        </p>
        <button
          onClick={() => {
            router.push("/").then(() => {
              window.location.reload();
            });
          }}
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Complete;
