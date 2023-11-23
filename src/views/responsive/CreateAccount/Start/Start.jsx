import React from "react";
import styles from "./start.module.css";
import createProfile_start from "../../../../assets/createProfile/createProfile_start.json";
import Lottie from "react-lottie";
import { GrFormClose } from "react-icons/gr";
import { useRouter } from "next/router";

const Start = ({ setPage }) => {
  const router = useRouter();
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: createProfile_start,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <div className={styles.page}>
      <div className={styles.profileComp}>
        <GrFormClose
          className={styles.svg}
          onClick={() => {
            window.location.replace("/guestuser");
          }}
        />
        <Lottie options={defaultOptions} height={200} width={200} />
        <h2>Create Your Profile</h2>
        <p>
          You don't have an profile yet. Please create your profile to view this
          information.
        </p>
        <button onClick={() => setPage(1)}>Let's get started!</button>
        {/* <p
          style={{
            fontSize: "12px",
            fontFamily: "Poppins",
            color: "#707070",
            marginTop: "10px",
          }}
        >
          Click <u style={{ color: "#F8CD46" }}>here</u> for more information
        </p> */}
      </div>
    </div>
  );
};

export default Start;
