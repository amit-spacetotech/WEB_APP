import React from "react";
import styles from "./complete.module.css";
import createProfile_start from "../../../../assets/createProfile/createProfile_start.json";
import Lottie from "react-lottie";

const Complete = ({ setPage }) => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: createProfile_start,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <div className={styles.profileComp}>
      <Lottie options={defaultOptions} height={150} width={150} />
      <h2>Your home is now listed</h2>
      <p>
        Please note that if you successfully find a housemate on HomeShare, you
        will be liable for the success fee of 3%. You can click below for more
        information.
      </p>
      <button
        onClick={() => {
          window.location.replace("/");
          window.location.reload();
        }}
      >
        I understand
      </button>
    </div>
  );
};

export default Complete;
