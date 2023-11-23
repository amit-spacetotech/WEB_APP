import React, { useState } from "react";
import { Button, CloseButton } from "react-bootstrap";
import SimpleInput from "../common/simpleInput";
import styles from "./auth.module.css";
import { connect } from "react-redux";
import { setSDSKd } from "../../redux/actions/auth";
import googleImg from "../../assets/landing/google.png";
import facebookImg from "../../assets/landing/facebook.png";
import { getUser } from "@/redux/actions/auth";
import { auth, provider, fbProvider } from "../../config/config";
import { signInWithPopup } from "firebase/auth";
import { useRouter } from "next/router";
import CryptoJS from "crypto-js";
import { BsFillEyeFill } from "react-icons/bs";
import { AiFillEyeInvisible } from "react-icons/ai";
import axios from "axios";
import { Checkbox } from "antd";
const encrypt = (text) => {
  return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(text));
};

function decrypt(data) {
  if (!data) {
    return null;
  }
  return CryptoJS.enc.Base64.parse(data).toString(CryptoJS.enc.Utf8);
}

function Login(props) {
  const router = useRouter();
  const [rememberChecked, setRememberChecked] = useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const storedData = localStorage.getItem("LoginCredentials");
  const decryptedData = decrypt(storedData);

  const formDatadecrypt = JSON.parse(decryptedData);
  const [formData, setFormData] = React.useState(
    formDatadecrypt || {
      email: "",
      password: "",
    }
  );

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState({
    email: false,
    password: false,
  });
  console.log(rememberChecked);
  const [showPopover, setShowPopover] = useState(false);
  React.useEffect(() => {
    getUser();
    if (localStorage.getItem("LoginCredentials")) {
      setRememberChecked(true);
    }
  }, []);

  function validateEmail(email) {
    const pattern = /^[\w.-]+@[\w.-]+\.\w+$/;

    return pattern.test(email);
  }

  const validate = () => {
    const newErrors = {};

    Object.keys(formData).forEach((key) => {
      if (
        key === "password" ? !formData[key] : !validateEmail(formData.email)
      ) {
        newErrors[key] =
          key == "password"
            ? "Please enter password"
            : "Please enter valid email";
      }
    });

    setError(newErrors);

    if (Object.keys(newErrors).length < 1) {
      console.log("COMING HERE");
      return true;
    }
  };
  // const validate = () => {
  //   let err = false;
  //   const basicForm = {
  //     email: "",
  //     password: "",
  //   };
  //   Object.keys(basicForm).forEach((key) => {
  //     if (!formData[key]) {
  //       newErrors[key] = `${errorMessage[key]} is required`;
  //     }
  //   });
  //   if (formData.password === "") {
  //     setError({ ...error, password: "Please enter password" });
  //     err = true;
  //   } else {
  //     setError({ ...error, password: "" });
  //   }

  //   if (!validateEmail(formData.email)) {
  //     setError({ ...error, email: "Please enter valid email" });
  //     err = true;
  //   } else {
  //     setError({ ...error, email: "" });
  //   }
  //   return err;
  // };

  const rememberMe = (value) => {
    if (rememberChecked) {
      const formDataString = JSON.stringify(formData);
      const encryptedData = encrypt(formDataString);
      localStorage.setItem("LoginCredentials", encryptedData);
    }
  };

  const handleEmailLogin = () => {
    if (validate()) {
      setLoading(true);
      axios({
        method: "post",
        url: `/auth/login`,
        basic: true,
        headers: {
          Authorization:
            "Basic SE9NRVNIQVJFOlJBTkRPTUhPTUVTSEFSRVBBU1NXT1JEUE9JVVlUUkVRV0VSVFlVSQ==",
          "Content-Type": "application/json",
        },
        data: { ...formData },
      })
        .then((res) => {
          if (rememberChecked) {
            rememberMe();
          } else {
            localStorage.removeItem("LoginCredentials");
          }

          setLoading(false);
          localStorage.setItem("token", res.data.token);
          !props.responsive &&
            props.setAuth({ ...auth, login: false, signup: false });
          props.responsive && window.location.replace("/");
          !props.responsive &&
            router.push("/").then(() => {
              window.location.reload();
            });
        })
        .catch((err) => {
          setLoading(false);
          alert(
            err.response?.data
              ? err.response.data.error
              : "OOPS! SOMETHING WENT WRONG"
          );
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
          props.setAuth({ ...auth, login: false, signup: false });
        props.responsive && window.location.replace("/");
        !props.responsive &&
          router.push("/").then(() => {
            window.location.reload();
          });
      })
      .catch((err) => {
        console.log(err);
        alert(
          err.response && err.response.data
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
        console.log(err, err.response);
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
          props.setAuth({ ...auth, login: false, signup: false });
        props.responsive && router.push("/");
        !props.responsive && window.location.reload();
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

  return (
    <div>
      {props.responsive ? (
        <div className={styles.headResLogin}>
          <div className={styles.welcome}>
            <h4 className={styles.title}>
              Welcome to <br />
              HomeShare
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
        </div>
      ) : (
        <h4 className={`${styles.header} text-center pt-2 pb-3 `}>
          Welcome to HomeShare
        </h4>
      )}

      <div style={{ width: props.responsive ? "90%" : "70%", margin: "auto" }}>
        <SimpleInput
          placeholder="Email"
          type="email"
          error={error.email}
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <div className={styles.sPDiv}>
          <input
            placeholder="Password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            style={{ marginTop: "10px" }}
            type={!showPassword ? "password" : "text"}
          />
          <button
            className={styles.showPassword}
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <AiFillEyeInvisible /> : <BsFillEyeFill />}
          </button>
        </div>
        {error.password ? (
          <label
            className="simple-select-error"
            style={{ fontSize: "0.7rem", color: "red" }}
          >
            *{error.password}
          </label>
        ) : null}
        <div className={`${styles.forgotSection} `}>
          <div className="d-flex align-items-center">
            <Checkbox
              className="custom-checkbox"
              style={{ width: "15px", marginRight: "5px" }}
              onChange={() => setRememberChecked((prev) => !prev)}
              checked={rememberChecked}
            />
            <p>Remember me</p>
          </div>
          <p
            style={{
              textDecoration: "underline",
            }}
          >
            <span
              style={{ cursor: "pointer", color: "black" }}
              onClick={() => {
                !props.responsive &&
                  props.setAuth({
                    forgot: true,
                    verify: false,
                    signup: false,
                    login: false,
                  });
                props.responsive && router.push("/forgotPassword");
              }}
            >
              Forgot Password ?
            </span>
          </p>
        </div>
        <Button
          type="submit"
          // disabled={!props.formData.email || !props.formData.password}
          className={styles.authButton}
          onClick={() => {
            handleEmailLogin();
          }}
        >
          {loading ? "Please wait..." : "Login"}
        </Button>
        <div className={styles.head2}>
          <span />
          <p className="mb-0 px-2 ">or</p>
          <span />
        </div>
        <div className={styles.oAuthButton} onClick={() => handleGoogle()}>
          <img src={googleImg.src} alt="Google" />
          <h4>Continue With Google</h4>
        </div>

        {/* <div className={styles.oAuthButton} onClick={() => handleFacebook()}>
          <img src={facebookImg.src} alt="Google" />
          <h4>Continue With Facebook</h4>
        </div> */}

        <h4 className={styles.head1}>
          Don't have an account?{" "}
          <span
            onClick={() =>
              props.responsive
                ? router.push("/signup")
                : props.setAuth({
                    ...auth,
                    login: false,
                    signup: true,
                    otp: false,
                  })
            }
          >
            Sign Up
          </span>
        </h4>
      </div>
    </div>
  );
}
const mapStateToProps = (state) => {
  return {
    auth: state.auth,
  };
};

export default connect(mapStateToProps, { setSDSKd })(Login);
