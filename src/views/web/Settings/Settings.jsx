import React from "react";
import styles from "./Settings.module.css";
import AppLoader from "@/utils/AppLoader/AppLoader";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import { Input } from "antd";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import { Switch } from "antd";
import axios from "axios";
import { getSingleUser } from "@/redux/actions/auth";

function Settings(props) {
  const [emailChange, setEmailChange] = React.useState(false);
  const [hide, setHide] = React.useState({
    confirm: false,
    new: false,
  });
  const [timeRemaining, setTimeRemaining] = React.useState(30);
  const [emailUpdate, setEmailUpdate] = React.useState({
    email: "",
    otp: "",
  });
  const [authentication, setAuthentication] = React.useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [notification, setNotfication] = React.useState({
    isNews: false,
    isMessages: false,
    isReminders: false,
  });
  const [errors, setErrors] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  function validateEmail(email) {
    const pattern = /^\S+[\w.-]*@[\w.-]+\.\w+$/;
    return pattern.test(email);
  }

  function validatePassword(password) {
    const pattern = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^a-zA-Z\d])[\w\d\S]{8,}$/;
    return pattern.test(password);
  }

  const handleSendOtp = () => {
    if (validateEmail(emailUpdate.email)) {
      axios({
        method: "post",
        url: `/utils/sendOtp`,
        basic: true,
        headers: {
          Authorization:
            "Basic SE9NRVNIQVJFOlJBTkRPTUhPTUVTSEFSRVBBU1NXT1JEUE9JVVlUUkVRV0VSVFlVSQ==",
          "Content-Type": "application/json",
        },
        data: { email: emailUpdate.email, settings: true },
      })
        .then((res) => {
          setEmailChange(true);
        })
        .catch((err) => {
          if (
            err &&
            err.response &&
            err.response.data &&
            err.response.data.message
          ) {
            setEmailUpdate({ ...emailUpdate, email: "" });
            alert(err.response.data.message);
          } else {
            alert("SOMETHING WENT WRONG ! PLEASE REFRESH YOUR PAGE");
          }
        });
    } else {
      setErrors({ ...errors, email: "Please enter valid email" });
    }
  };
  const verifyOtp = (otp) => {
    setLoading(true);
    axios({
      method: "post",
      url: `/utils/verifyOtp`,
      basic: true,
      headers: {
        Authorization:
          "Basic SE9NRVNIQVJFOlJBTkRPTUhPTUVTSEFSRVBBU1NXT1JEUE9JVVlUUkVRV0VSVFlVSQ==",
        "Content-Type": "application/json",
      },
      data: { email: emailUpdate.email, otp: Number(emailUpdate.otp) },
    })
      .then((res) => {
        onSubmit();
      })
      .catch((err) => {
        err.response && err.response.data && alert(err.response.data.error);
      });
  };

  const deleteUser = (otp) => {
    axios({
      method: "put",
      url: `/user/updateUser`,

      headers: {
        "Content-Type": "application/json",
      },
      data: { deleted: true },
    })
      .then((res) => {
        localStorage.clear();
        router.push("/").then(() => {
          window.location.reload();
        });
      })
      .catch((err) => {
        err.response && err.response.data && alert(err.response.data.error);
      });
  };

  React.useEffect(() => {
    if (props.user.setting) {
      setNotfication({ ...notification, ...props.user.setting });
    }
  }, [props.user]);

  const validatePasswordForm = () => {
    const newErrors = {};
    const basicForm = {
      email: "Email",
      otp: "OTP",
      oldPassword: "Old password",
      newPassword: "New password",
      confirmPassword: "Confirm password",
    };
    Object.keys(basicForm).forEach((key) => {
      if (
        authentication["password"] ||
        authentication["confirmPassword"] ||
        authentication["newPassword"]
      ) {
        if (
          authentication["newPassword"] &&
          !validatePassword(authentication["newPassword"])
        ) {
          newErrors[
            "newPassword"
          ] = `Password must be 8+ characters with at least 1 letter, 1 number & 1 special character.`;
        }
        if (!authentication["newPassword"]) {
          newErrors["newPassword"] = `Please input new password`;
        }
        if (!authentication["oldPassword"]) {
          newErrors["oldPassword"] = `Please input old password`;
        }
        if (
          authentication["newPassword"] !== authentication["confirmPassword"] &&
          authentication["confirmPassword"]
        ) {
          newErrors["confirmPassword"] = `Password mismatch`;
        }
      }

      if (emailUpdate.email) {
        if (!emailUpdate.otp) {
          newErrors["otp"] = `Please either input OTP or clear email field`;
        }
      }
    });

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      return true;
    } else {
      return false;
    }
  };

  const onSubmit = () => {
    if (validatePasswordForm()) {
      setLoading(true);
      axios({
        method: "put",
        url: `/user/updateUserSettings`,
        headers: {
          "Content-Type": "application/json",
        },
        data: { authentication, notification },
      })
        .then((val) => {
          setLoading(false);
          window.alert("Updated successfully");
          window.location.reload();
        })
        .catch((err) => {
          setLoading(false);
          console.log(err);
          err.response &&
            err.response.data &&
            err.response.data.message &&
            alert(err.response.data.message);
        });
    }
  };
  React.useEffect(() => {
    let timer;

    if (emailChange && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prevTime) => prevTime - 1);
      }, 1000);
      timeRemaining === 1 && setEmailChange(true);
    }

    return () => clearInterval(timer);
  }, [emailChange, timeRemaining]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>General Settings</h2>
        <button
          onClick={() => {
            emailUpdate.otp ? verifyOtp() : onSubmit();
          }}
        >
          Update
        </button>
      </div>
      <div className={styles.content}>
        <div className={styles.leftContent}>
          <h3 className={styles.emailUpdate}>Email Update</h3>
          <Input
            placeholder="New email"
            disabled
            value={props.user.email}
            // onChange={(e) =>
            //   setEmailUpdate({ ...emailUpdate, email: e.target.value })
            // }
            style={{
              borderLeft: 0,
              paddingLeft: 0,
              borderRadius: 0,
              borderTop: 0,
              borderRight: 0,
              boxShadow: "none",
              borderColor: "#707070",
              margin: "0.65rem 0",
            }}
          />
          {emailChange && (
            <Input
              type="number"
              value={emailUpdate.otp}
              onChange={(e) => {
                if (e.target.value.length <= 4) {
                  setEmailUpdate({ ...emailUpdate, otp: e.target.value });
                }
              }}
              placeholder="Enter verification code"
              style={{
                borderLeft: 0,
                paddingLeft: 0,
                borderRadius: 0,
                borderTop: 0,
                borderRight: 0,
                boxShadow: "none",
                borderColor: "#707070",
                margin: "0.65rem 0",
              }}
              suffix={<p>00:{timeRemaining}sec</p>}
            />
          )}
          {errors.otp && <span className={styles.errors}>{errors.otp}</span>}
          <h3 className={styles.authentication}>Authentication</h3>
          <Input
            placeholder="Old password"
            value={authentication.oldPassword}
            onChange={(e) =>
              setAuthentication({
                ...authentication,
                oldPassword: e.target.value,
              })
            }
            style={{
              borderLeft: 0,
              borderRadius: 0,
              paddingLeft: 0,
              borderTop: 0,
              borderRight: 0,
              boxShadow: "none",
              borderColor: "#707070",
              margin: "0.65rem 0",
            }}
          />
          {errors.oldPassword && (
            <span className={styles.errors}>{errors.oldPassword}</span>
          )}
          <Input
            type={hide.new ? "password" : "text"}
            placeholder="New password"
            value={authentication.newPassword}
            onChange={(e) =>
              setAuthentication({
                ...authentication,
                newPassword: e.target.value,
              })
            }
            style={{
              borderLeft: 0,
              borderRadius: 0,
              paddingLeft: 0,
              borderTop: 0,
              borderRight: 0,
              boxShadow: "none",
              borderColor: "#707070",
              margin: "0.6rem 0",
            }}
            suffix={
              hide.new ? (
                <BsEyeFill
                  color="#B3B3B3"
                  onClick={() => setHide({ ...hide, new: false })}
                />
              ) : (
                <BsEyeSlashFill
                  color="#B3B3B3"
                  onClick={() => setHide({ ...hide, new: true })}
                />
              )
            }
          />
          {errors.newPassword && (
            <span className={styles.errors}>{errors.newPassword}</span>
          )}
          <Input
            type={hide.confirm ? "password" : "text"}
            placeholder="Confirm password"
            value={authentication.confirmPassword}
            onChange={(e) =>
              setAuthentication({
                ...authentication,
                confirmPassword: e.target.value,
              })
            }
            style={{
              borderLeft: 0,
              paddingLeft: 0,
              borderRadius: 0,
              borderTop: 0,
              borderRight: 0,
              boxShadow: "none",
              borderColor: "#707070",
              margin: "0.6rem 0",
            }}
            suffix={
              hide.confirm ? (
                <BsEyeFill
                  color="#B3B3B3"
                  onClick={() => setHide({ ...hide, confirm: false })}
                />
              ) : (
                <BsEyeSlashFill
                  color="#B3B3B3"
                  onClick={() => setHide({ ...hide, confirm: true })}
                />
              )
            }
          />
          {errors.confirmPassword && (
            <span className={styles.errors}>{errors.confirmPassword}</span>
          )}
        </div>
        <div className={styles.rightContent}>
          <h3 className={styles.headerNot}>Notification</h3>
          <p className={styles.subHeading}>
            Get emails to find out what's happening when you are not online. You
            can turn these off.
          </p>
          {/* <div className={styles.flexNotification}>
            <div className={styles.select}>
              <Switch
                checked={notification.isNews}
                onChange={() =>
                  setNotfication({
                    ...notification,
                    isNews: !notification.isNews,
                  })
                }
              />
            </div>
            <div className={styles.text}>
              <h3>News Update</h3>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Leo
                vel fringilla est ullamcorper. Tempor{" "}
              </p>
            </div>
            <div className={styles.suggested}>
              <button>Suggested</button>
            </div>
          </div> */}
          <div className={styles.flexNotification}>
            <div className={styles.select}>
              <Switch
                checked={notification.isMessages}
                onChange={() =>
                  setNotfication({
                    ...notification,
                    isMessages: !notification.isMessages,
                  })
                }
              />
            </div>
            <div className={styles.text}>
              <h3>Messages</h3>
              <p>
                Receive an email notifying you of a new message in your
                HomeShare inbox.{" "}
              </p>
            </div>
            <div className={styles.suggested}>
              <button>Suggested</button>
            </div>
          </div>
          {/* <div className={styles.flexNotification}>
            <div className={styles.select}>
              <Switch
                checked={notification.isReminders}
                onChange={() =>
                  setNotfication({
                    ...notification,
                    isReminders: !notification.isReminders,
                  })
                }
              />
            </div>
            <div className={styles.text}>
              <h3>Reminders</h3>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Leo
                vel fringilla est ullamcorper. Tempor{" "}
              </p>
            </div>
            <div className={styles.suggested}>
              <button>Suggested</button>
            </div>
          </div> */}
        </div>
      </div>
      <div className={styles.footer}>
        <button onClick={() => deleteUser()}>Delete account</button>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
  };
};

export default connect(mapStateToProps, { getSingleUser })(Settings);
