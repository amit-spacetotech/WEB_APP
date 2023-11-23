import React from "react";
import styles from "./start.module.css";
import createProfile_start from "../../../../assets/createProfile/createProfile_start.json";
import Lottie from "react-lottie";
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
    <div className={styles.profileComp}>
      <Lottie options={defaultOptions} height={150} width={150} />
      <h2>List your home</h2>
      <p>
        Please note that listing your property is completely free at HomeShare.
        We only charge a success fee of 3% of your annual rent amount if you
        successfully find a housemate on our platform.
      </p>
      <button onClick={() => setPage(1)}>Let's get started!</button>
      <p
        style={{
          fontSize: "12px",
          fontFamily: "Poppins",
          color: "#707070",
          marginTop: "10px",
          marginBottom: "30px",
        }}
      >
        Click{" "}
        <u
          style={{ color: "#F8CD46" }}
          onClick={() => {
            router.push("/pricing");
            // window.location.reload();
          }}
        >
          here
        </u>{" "}
        for more information
      </p>
    </div>
  );
};

export default Start;
