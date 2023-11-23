import React, { useEffect, useRef, useState } from "react";
import styles from "./Page.module.css";
import { IoIosArrowBack } from "react-icons/io";
import Webcam from "react-webcam";
import { useFaceDetection } from "react-use-face-detection";
import FaceDetection from "@mediapipe/face_detection";
import { Camera } from "@mediapipe/camera_utils";
import AppLoader from "@/utils/AppLoader/AppLoader";

const Page5 = ({
  page,
  setPage,
  setErrors,
  errors,
  handleCreateProfile,
  loading,
}) => {
  const { webcamRef, boundingBox, isLoading, detected, facesDetected } =
    useFaceDetection({
      faceDetectionOptions: {
        model: "short",
      },
      faceDetection: new FaceDetection.FaceDetection({
        locateFile: function (file) {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`;
        },
      }),
      camera: function (options) {
        return new Camera(options.mediaSrc, {
          onFrame: options.onFrame,
          maxWidth: "200px",
          maxHeight: "200px",
        });
      },
    });
  React.useEffect(() => {
    if (detected) {
      setErrors({ ...errors, detected: "" });
    }
  }, [detected, errors]);

  return (
    <div className={styles.page}>
      <div className={styles.formDiv}>
        <h1 className={styles.identity}>Identity verification</h1>
        <p className={styles.identityP}>
          To ensure the safety of our users, we are required to verify your
          identity
        </p>
        <div className={styles.innerDiv}>
          {isLoading && <p> Please wait camera is loading...</p>}
          <div
            style={{
              width: "100%",
              position: "relative",
              borderRadius: "20px",
            }}
          >
            {boundingBox.map((box, index) => (
              <div
                key={`${index + 1}`}
                style={{
                  border: "4px solid green",
                  position: "absolute",
                  top: `${box.yCenter * 100}%`,
                  left: `${box.xCenter * 100}%`,
                  width: `${box.width * 100}%`,
                  height: `${box.height * 100}%`,
                  zIndex: 1,
                }}
              />
            ))}
            <Webcam
              ref={webcamRef}
              forceScreenshotSourceSize
              style={{
                left: 0,
                right: 0,
                height: "250px",
                width: "100%",
                borderRadius: "20px",
                marginBlock: "20px",
              }}
            />
          </div>
        </div>
        {!detected && (
          <p className={styles.veryP}>
            Please align your camera for proper verification{" "}
          </p>
        )}
        {!detected && errors && errors.detection && (
          <span className={styles.error}>*{errors.detection}</span>
        )}
        <div className={styles.buttonDiv}>
          <div onClick={() => setPage(page - 1)}>
            <IoIosArrowBack fontSize="20px" /> Back
          </div>

          <button
            onClick={() => {
              detected
                ? handleCreateProfile()
                : setErrors({
                    ...errors,
                    detection: "Verification is required",
                  });
            }}
          >
            {loading ? "Creating Profile" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page5;
