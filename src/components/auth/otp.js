import React, { useState, useRef, useEffect } from "react";
import { Button } from "react-bootstrap";
import styles from "./auth.module.css";
import { connect } from "react-redux";

function Otp(props) {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = [];
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendTime, setResendTime] = useState(60);

  let confirmOtp = otp.join("");


  const handleInputChange = (e, index) => {
    const input = e.target;
    const maxLength = input.getAttribute("maxLength");
    const inputValue = input.value;

    if (e.nativeEvent.inputType === "deleteContentBackward") {
      // Check if Backspace key was pressed
      const newOtp = ["", "", "", ""]; // Clear the entire OTP state
      setOtp(newOtp);
      inputRefs[0].focus(); // Set focus to first input field
      return;
    }

    if (inputValue.length <= parseInt(maxLength)) {
      const newOtp = [...otp];
      newOtp[index] = inputValue;
      setOtp(newOtp);

      if (inputValue.length === parseInt(maxLength)) {
        if (inputRefs[index + 1]) {
          inputRefs[index + 1].focus();
        }
      }
    }
  };

  // Function to handle Resend button click
  const handleResendClick = () => {
   props.handleSendOtp()
    setResendDisabled(true);
    setResendTime(60);
  };

  // Update resend time every second
  useEffect(() => {
    let timer;
    if (resendTime > 0 && resendDisabled) {
      timer = setTimeout(() => {
        setResendTime(resendTime - 1);
      }, 1000);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [resendTime, resendDisabled]);

  // Show Resend button when countdown is over
  useEffect(() => {
    if (resendTime === 0 && resendDisabled) {
      setResendDisabled(false);
    }
  }, [resendTime, resendDisabled]);

  return (
    <div className={styles.otpContent}>
      
      <div className={styles.flexComp}>
        {Array(4)
          .fill(null)
          .map((_, index) => (
            <div className={styles.otpInput} key={index}>
              <input
                type="number"
                maxLength="1"
                ref={(input) => (inputRefs[index] = input)}
                value={otp[index]}
                onChange={(e) => handleInputChange(e, index)}
                placeholder="-"
                className={styles.otpInputTag}
              />
            </div>
          ))}
      </div>
      <span>{props.error}</span>
      {resendDisabled ? (
        <h4>Resend code in {resendTime} seconds</h4>
      ) : (
        <h4>
          Did not receive the verification code?{" "}
          <span onClick={handleResendClick}>
            <u>Resend Code</u>
          </span>
        </h4>
      )}
      <Button
        type="submit"
        className={styles.authButton}
        onClick={() => {
          props.verifyOtp(confirmOtp);
        }}
      >
        {props.loading ? "Verifying Otp" : "Submit"}
      </Button>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
  };
};

export default connect(mapStateToProps, null)(Otp);
