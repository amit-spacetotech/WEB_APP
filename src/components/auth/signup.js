import React, { useState } from "react";
import { Button, CloseButton } from "react-bootstrap";
import styles from "./auth.module.css";
import googleImg from "../../assets/landing/google.png";
import facebookImg from "../../assets/landing/facebook.png";
import axios from "axios";
import { useRouter } from "next/router";
import { auth, provider, fbProvider } from "../../config/config";
import { signInWithPopup } from "firebase/auth";
import Otp from "./otp";
import { BsFillEyeFill } from "react-icons/bs";
import { AiFillEyeInvisible } from "react-icons/ai";

function SignUp(props) {
  const router = useRouter();
  const [currentState, setCurrentState] = React.useState("SIGN_UP");
  const [isEnable, setIsEnable] = React.useState(false);
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
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
  });
  const [authentication, setAuthentication] = useState({
    login: false,
    signup: false,
  });

  function validateEmail(email) {
    const pattern = /^\S+[\w.-]*@[\w.-]+\.\w+$/;

    return pattern.test(email);
  }
  function validatePassword(password) {
    const pattern = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^a-zA-Z\d])[\w\d\S]{8,}$/;

    // Password must contain at least one letter, one number, one special character, and be at least 8 characters long.

    return pattern.test(password);
  }

  const validate = () => {
    const newErrors = {};
    const basicForm = {
      email: "",
      password: "",
      confirmPassword: "",
    };
    Object.keys(basicForm).forEach((key) => {
      if (key === "email") {
        if (!validateEmail(formData[key])) {
          newErrors[key] = `Please enter valid email`;
        }
      }

      if (!formData["password"]) {
        newErrors["password"] = `Please enter password`;
      }
      if (!validatePassword(formData["password"])) {
        newErrors[
          "password"
        ] = `Password must be 8+ characters with at least 1 letter, 1 number & 1 special character.`;
      }
      if (!formData["confirmPassword"]) {
        newErrors["confirmPassword"] = `Please enter confirm password`;
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
    setLoading({ ...loading, signup: true });
    axios({
      method: "post",
      url: `/utils/sendOtp`,
      basic: true,
      headers: {
        Authorization:
          "Basic SE9NRVNIQVJFOlJBTkRPTUhPTUVTSEFSRVBBU1NXT1JEUE9JVVlUUkVRV0VSVFlVSQ==",
        "Content-Type": "application/json",
      },
      data: { email: formData.email },
    })
      .then((res) => {
        setLoading({ ...loading, signup: false });
        setCurrentState("OTP");
      })
      .catch((err) => {
        setLoading({ ...loading, signup: false });
        alert("SOMETHING WENT WRONG ! PLEASE REFRESH YOUR PAGE");
      });
  };

  const CheckUserEmail = () => {
    if (validate()) {
      axios({
        method: "post",
        url: `/auth/checkUserEmail`,
        basic: true,
        headers: {
          Authorization:
            "Basic SE9NRVNIQVJFOlJBTkRPTUhPTUVTSEFSRVBBU1NXT1JEUE9JVVlUUkVRV0VSVFlVSQ==",
          "Content-Type": "application/json",
        },
        data: { email: formData.email },
      })
        .then((res) => {
          if (res.data.status) {
            alert("This email is already registered with us");
          } else {
            handleSendOtp();
          }
        })
        .catch((err) => {
          setLoading({ ...loading, signup: false });
          alert("SOMETHING WENT WRONG ! PLEASE REFRESH YOUR PAGE");
        });
    }
  };
  const handleSignup = () => {
    axios({
      method: "post",
      url: `/auth/register`,
      basic: true,
      headers: {
        Authorization:
          "Basic SE9NRVNIQVJFOlJBTkRPTUhPTUVTSEFSRVBBU1NXT1JEUE9JVVlUUkVRV0VSVFlVSQ==",
        "Content-Type": "application/json",
      },
      data: { email: formData.email, password: formData.password },
    })
      .then((res) => {
        setLoading({ ...loading, otp: false });
        localStorage.setItem("token", res.data.token);
        props.responsive
          ? window.location.replace("/")
          : router.push("/").then(() => {
              window.location.reload();
            });
      })
      .catch((err) => {
        alert(
          err.response.data
            ? err.response.data.error
            : "OOPS! SOMETHING WENT WRONG"
        );
      });
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
          handleSignup();
          !props.responsive &&
            props.setAuth({ login: false, otp: false, signup: false });
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

  const googelAuth = (email) => {
    axios({
      method: "put",
      url: `/auth/googleAuth`,
      basic: true,
      headers: {
        "Content-Type": "Application/json",

        Authorization:
          "Basic SE9NRVNIQVJFOlJBTkRPTUhPTUVTSEFSRVBBU1NXT1JEUE9JVVlUUkVRV0VSVFlVSQ==",
      },
      data: { email },
    })
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        !props.responsive &&
          props.setAuth({ ...authentication, login: false, signup: false });
        props.responsive
          ? window.location.replace("/")
          : window.location.reload();
      })
      .catch((err) => {
        alert(
          err.response.data
            ? err.response.data.error
            : "OOPS! SOMETHING WENT WRONG"
        );
      });
  };
  const handleGoogle = () => {
    signInWithPopup(auth, provider)
      .then((data) => {
        googelAuth(data.user.email);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const facebookAuth = (email, userName) => {
    axios({
      method: "put",
      url: `/auth/facebookAuth`,
      basic: true,
      headers: {
        "Content-Type": "Application/json",

        Authorization:
          "Basic SE9NRVNIQVJFOlJBTkRPTUhPTUVTSEFSRVBBU1NXT1JEUE9JVVlUUkVRV0VSVFlVSQ==",
      },
      data: { email, userName },
    })
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        !props.responsive &&
          props.setAuth({ ...authentication, login: false, signup: false });
        props.responsive
          ? window.location.replace("/")
          : window.location.reload();
      })
      .catch((err) => {
        alert(
          err.response.data
            ? err.response.data.error
            : "OOPS! SOMETHING WENT WRONG"
        );
      });
  };
  const handleFacebook = () => {
    signInWithPopup(auth, fbProvider)
      .then((data) => {
        facebookAuth(data.user.email, data.user.displayName);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleLinkClick = () => {
    window.open("/privacy", "_blank");
  };
  return (
    <div>
      {props.responsive ? (
        <div className={styles.headRes}>
          {currentState === "SIGN_UP" && (
            <div className={styles.welcome}>
              <h4 className={styles.title}>
                Welcome to
                <br /> HomeShare
              </h4>
              <p
                className={styles.num}
                onClick={() => {
                  router.push("/");
                }}
              >
                <CloseButton />
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
          {currentState === "SIGN_UP" && (
            <h4 className={`${styles.header} text-center mt-3 pb-2 `}>
              Welcome to HomeShare
            </h4>
          )}
        </>
      )}
      {currentState === "SIGN_UP" && (
        <div className={styles.content}>
          <input
            placeholder="Email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          {errors.email ? (
            <label
              className="simple-select-error"
              style={{ fontSize: "0.7rem", color: "red" }}
            >
              *{errors.email}
            </label>
          ) : null}
          <div className={styles.sPDiv}>
            <input
              placeholder="Password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              style={{ marginTop: "10px" }}
              type={!showPassword1 ? "password" : "text"}
            />

            <button
              className={styles.showPassword}
              onClick={() => setShowPassword1((prev) => !prev)}
            >
              {showPassword1 ? <AiFillEyeInvisible /> : <BsFillEyeFill />}
            </button>
          </div>
          {errors.password ? (
            <label
              className="simple-select-error"
              style={{ fontSize: "0.7rem", color: "red" }}
            >
              *{errors.password}
            </label>
          ) : null}
          <div className={styles.sPDiv}>
            <input
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              style={{ marginTop: "10px" }}
              type={!showPassword2 ? "password" : "text"}
            />
            <button
              className={styles.showPassword}
              onClick={() => setShowPassword2((prev) => !prev)}
            >
              {showPassword2 ? <AiFillEyeInvisible /> : <BsFillEyeFill />}
            </button>
          </div>
          {errors.confirmPassword ? (
            <label
              className="simple-select-error"
              style={{ fontSize: "0.7rem", color: "red" }}
            >
              *{errors.confirmPassword}
            </label>
          ) : null}

          <div className={`${styles.agreeSection} `}>
            <div className="d-flex">
              <input
                type="checkbox"
                onChange={() => {
                  setIsEnable(!isEnable);
                }}
                style={{ width: "15px", marginRight: "5px", height: "15px" }}
                // onChange={(e) => setSubmit(e.target.checked)}
              />
              <p style={{ fontWeight: "600" }}>
                I agree to the{" "}
                <span
                  style={{ cursor: "pointer" }}
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick();
                  }}
                >
                  <u>Terms & Conditions</u>
                </span>
              </p>
            </div>
          </div>
          <Button
            type="submit"
            disabled={!isEnable}
            className={styles.authButton}
            onClick={() => {
              CheckUserEmail();
            }}
          >
            {loading.signup
              ? "Sending otp to your entered email..."
              : "Sign Up"}
          </Button>
          <div className={styles.head2}>
            <span />
            <p className="mb-0 px-2 fw-bold ">Or</p>
            <span />
          </div>

          <div className={styles.oAuthButton} onClick={() => handleGoogle()}>
            <img src={googleImg.src} alt="Google" />
            <h4>Continue With Google</h4>
          </div>

          {/* <div className={styles.oAuthButton} onClick={handleFacebook}>
            <img src={facebookImg.src} alt="Google" />
            <h4>Continue With Facebook</h4>
          </div> */}

          <h4 className={styles.head1}>
            Already have an account?{" "}
            <span
              onClick={() =>
                props.responsive
                  ? router.push("/login")
                  : props.setAuth({
                      ...auth,
                      login: true,
                      signUp: false,
                      otp: false,
                    })
              }
            >
              {" "}
              Login
            </span>
          </h4>
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
