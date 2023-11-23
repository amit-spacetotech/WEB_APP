import React from "react";

import Webcam from "react-webcam";
import { useFaceDetection } from "react-use-face-detection";
import FaceDetection from "@mediapipe/face_detection";
import { Camera } from "@mediapipe/camera_utils";
function Facecam(props) {
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
          // width: "200px",
          // height: "200px",
        });
      },
    });
  React.useEffect(() => {
    !detected && props.setFaceDetected(false);
    detected && props.setFaceDetected(true);
  }, [detected]);

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "center",
        position: "relative",
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
            zIndex: 0,
          }}
        />
      ))}

      <Webcam
        ref={webcamRef}
        forceScreenshotSourceSize
        style={{
          left: 0,
          right: 0,
          height: "200px",
          borderRadius: "20px",
          marginBlock: "20px",
        }}
      />
      {isLoading && <p>Please wait camera is loading</p>}
      {!detected&&!isLoading && <p>Please align your camera for proper verification</p>}
    </div>
  );
}

export default Facecam;
