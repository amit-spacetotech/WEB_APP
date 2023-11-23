import React from "react";
import styles from "./auth.module.css";
import axios from "axios";
import { useRouter } from "next/router";

import Otp from "./otp";
import { BsFillEyeFill } from "react-icons/bs";
import { AiFillEyeInvisible } from "react-icons/ai";
import SimpleInput from "../common/simpleInput";

function SignUp(props) {
  const router = useRouter();
  const [currentState, setCurrentState] = React.useState("EMAIL");
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = React.useState({});
  const [error, setError] = React.useState({
    confirmPassword: false,
    password: false,
    email: false,
    otp: false,
  });

  const [loading, setLoading] = React.useState({
    signUp: false,
    otp: false,
    email: false,
    reset: false,
  });

  function validateEmail(email) {
    const pattern = /^\S+[\w.-]*@[\w.-]+\.\w+$/;
    return pattern.test(email);
  }
  function validatePassword(password) {
    const pattern = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^a-zA-Z\d])[\w\d\S]{8,}$/;
    return pattern.test(password);
  }

  const validatePasswordForm = () => {
    const newErrors = {};
    const basicForm = {
      password: "Password",
      confirmPassword: "Confirm password",
    };
    Object.keys(basicForm).forEach((key) => {
      if (!formData[key]) {
        newErrors[key] = `${basicForm[key]} is required`;
      }

      if (formData["password"] && !validatePassword(formData["password"])) {
        newErrors[
          "password"
        ] = `Password must be 8+ characters with at least 1 letter, 1 number & 1 special character.`;
      }

      if (
        formData["password"] !== formData["confirmPassword"] &&
        formData["confirmPassword"]
      ) {
        newErrors["confirmPassword"] = `Password mismatch`;
      }
    });

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      return true;
    } else {
      return false;
    }
  };
  const handleSendOtp = () => {
    if (validateEmail(formData.email)) {
      setLoading({ ...loading, email: true });
      axios({
        method: "post",
        url: `/utils/sendOtp`,
        basic: true,
        headers: {
          Authorization:
            "Basic SE9NRVNIQVJFOlJBTkRPTUhPTUVTSEFSRVBBU1NXT1JEUE9JVVlUUkVRV0VSVFlVSQ==",
          "Content-Type": "application/json",
        },
        data: { email: formData.email, forgot: true },
      })
        .then((res) => {
          setLoading({ ...loading, email: false });
          setCurrentState("OTP");
        })
        .catch((err) => {
          setLoading({ ...loading, email: false });
          if (
            err &&
            err.response &&
            err.response.data &&
            err.response.data.message
          ) {
            alert(err.response.data.message);
          } else {
            alert("SOMETHING WENT WRONG ! PLEASE REFRESH YOUR PAGE");
          }
        });
    } else {
      setError({
        ...error,
        email: formData.email
          ? "Please enter valid email"
          : "Please enter email",
      });
    }
  };

  const forgotPassword = () => {
    if (validatePasswordForm()) {
      setLoading({ ...loading, reset: true });
      axios({
        method: "put",
        url: `/auth/forgotPassword`,
        basic: true,
        headers: {
          Authorization:
            "Basic SE9NRVNIQVJFOlJBTkRPTUhPTUVTSEFSRVBBU1NXT1JEUE9JVVlUUkVRV0VSVFlVSQ==",
          "Content-Type": "application/json",
        },
        data: { email: formData.email, password: formData.password },
      })
        .then((res) => {
          setLoading({ ...loading, reset: false });
          !props.responsive &&
            props.setAuth({ ...props.auth, forgot: false, login: true });
          props.responsive && router.push("/login");
          // setCurrentState("OTP");
          alert("Password updated successfully");
        })
        .catch((err) => {
          err.response &&
            err.response.data &&
            err.response.data.message &&
            alert(err.response.data.message);
          setLoading({ ...loading, reset: false });
        });
    }
  };
  const verifyOtp = (otp) => {
    if (String(otp).length > 3) {
      setLoading({ ...loading, otp: true, signUp: false });
      axios({
        method: "post",
        url: `/utils/verifyOtp`,
        basic: true,
        headers: {
          Authorization:
            "Basic SE9NRVNIQVJFOlJBTkRPTUhPTUVTSEFSRVBBU1NXT1JEUE9JVVlUUkVRV0VSVFlVSQ==",
          "Content-Type": "application/json",
        },
        data: { email: formData.email, otp: Number(otp) },
      })
        .then((res) => {
          setLoading({ ...loading, otp: false, signUp: false });
          setCurrentState("PASSWORD");
        })
        .catch((err) => {
          setLoading({ ...loading, otp: false });

          setError({
            ...error,
            otp: err.response && err.response.data && err.response.data.error,
          });
        });
    } else {
      setError({
        ...error,
        otp: "Please enter OTP",
      });
    }
  };

  return (
    <div>
      {props.responsive ? (
        <div className={styles.headRes}>
          {currentState === "EMAIL" && (
            <div className={styles.resOtpHeader}>
              <h4 className={styles.title}>Forgot password?</h4>
              <p>
                Enter your registered email id <br />
              </p>
            </div>
          )}
          {currentState === "OTP" && (
            <div className={styles.resOtpHeader}>
              <h4>Verification</h4>
              <p>
                Enter the Verification Code sent to given Email ID <br />
                <span>
                  {formData.email.replace(
                    formData.email.slice(3, 10),
                    "*".repeat(5)
                  )}
                </span>
              </p>
            </div>
          )}
          {currentState === "PASSWORD" && (
            <div className={styles.resOtpHeader}>
              {" "}
              <h4>Reset password?</h4>
              <p>
                Your code has been verified. Please ensure your new password is
                strong <br />
              </p>
            </div>
          )}
        </div>
      ) : (
        <>
          {currentState === "OTP" && (
            <div className={styles.OtpHeader}>
              <h4>Verification</h4>
              <p>
                Enter the Verification Code sent to given Email ID <br />
                <span>
                  {formData.email.replace(
                    formData.email.slice(3, 10),
                    "*".repeat(5)
                  )}
                </span>
              </p>
            </div>
          )}
        </>
      )}
      {currentState === "EMAIL" && (
        <div className={styles.OtpHeader}>
          {!props.responsive && (
            <>
              <h4>Forgot password</h4>
              <p>
                Enter your registered email id <br />
              </p>
            </>
          )}
          <SimpleInput
            value={formData.email}
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value });
              setError({ ...error, email: false });
            }}
            error={error.email}
            placeholder="Email"
            style={{ width: "90%", margin: "0 auto" }}
          />

          <button className={styles.sendCode} onClick={() => handleSendOtp()}>
            {loading.email ? "Sending code..." : "Send verification code"}
          </button>
        </div>
      )}

      {currentState === "PASSWORD" && (
        <div className={styles.OtpHeader}>
          {!props.responsive && (
            <>
              <h4>Reset password</h4>
              <p>
                Your code has been verified. Please ensure your new password is
                strong <br />
              </p>
            </>
          )}
          <SimpleInput
            value={formData.password}
            onChange={(e) => {
              setFormData({ ...formData, password: e.target.value });
            }}
            error={errors.password}
            placeholder="New password"
            style={{ width: "90%", margin: "0.4rem auto" }}
          />
          <SimpleInput
            value={formData.confirmPassword}
            onChange={(e) => {
              setFormData({ ...formData, confirmPassword: e.target.value });
            }}
            error={errors.confirmPassword}
            placeholder="Confirm password"
            style={{ width: "90%", margin: "0.4rem auto" }}
          />
          <button
            className={styles.resetButton}
            onClick={() => forgotPassword()}
          >
            {loading.reset ? "Resetting..." : "Reset"}
          </button>
        </div>
      )}
      {currentState === "OTP" && (
        <Otp
          responsive="true"
          email={formData.email}
          handleSendOtp={handleSendOtp}
          verifyOtp={verifyOtp}
          loading={loading.otp}
          error={error.otp}
        />
      )}
    </div>
  );
}

export default SignUp;
