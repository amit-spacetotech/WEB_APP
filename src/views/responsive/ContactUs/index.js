import SimpleInput from "@/components/common/simpleInput";
import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import styles from "./contact.module.css";
import axios from "axios";
import { useRouter } from "next/router";

function ContactRes() {
  const router = useRouter();
  const [submit, setSubmit] = useState(false);
  const [errors, setErrors] = React.useState({});

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    type: "",
    description: "",
  });

  const validateEmail = (email) => {
    const pattern = /^[\w.-]+@[\w.-]+\.\w+$/;

    return pattern.test(email);
  };

  const PostData = () => {
    axios({
      method: "post",
      basic: true,
      url: "/contact/addQuery",
      headers: {
        Authorization:
          "Basic SE9NRVNIQVJFOlJBTkRPTUhPTUVTSEFSRVBBU1NXT1JEUE9JVVlUUkVRV0VSVFlVSQ==",
        "Content-Type": "application/json",
      },
      data: { ...formData },
    }).then((res) => {
      alert("Submitted Successfully");
      setFormData({
        ...formData,
        description: "",
        firstName: "",
        lastName: "",
        email: "",
        type: "",
      });
    });
  };
  const validateBasicForm = () => {
    const newErrors = {};
    const basicForm = {
      firstName: "",
      lastName: "",
      email: "",
      type: "",
      description: "",
    };

    Object.keys(basicForm).forEach((key) => {
      if (key === "email") {
        if (!validateEmail(formData[key])) {
          newErrors[key] = `*Enter valid email`;
        }
      } else if (!formData[key]) {
        newErrors[key] = `*Field is required`;
      }
    });

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      PostData();
    }
  };
  const handleLinkClick = () => {
    window.open("/privacy", "_blank");
  };
  const regex = /^[a-zA-Z\s]*$/;
  return (
    <div className={styles.container}>
      <div className="mb-4">
        <h4
          className={styles.head1}
          style={{ fontSize: "30px", marginTop: "14px" }}
        >
          <span>Contact</span> Us
        </h4>

        <div className={styles.head2}>
          <span />
          <h4
            className={styles.head1}
            style={{ fontSize: "14px", marginBottom: 0, padding: "0 5px" }}
          >
            We <span>love to hear</span> from you{" "}
          </h4>
          <span />
        </div>
      </div>

      <div className={styles.content2}>
        <SimpleInput
          type="text"
          placeholder="First name"
          value={formData.firstName}
          onChange={(e) => {
            const inputVal = e.target.value;
            if (regex.test(inputVal) && inputVal.length <= 15) {
              setFormData({
                ...formData,
                firstName: inputVal,
              });
            }
          }}
        />
        {errors && errors.firstName && (
          <span className={styles.error}>{errors.firstName}</span>
        )}
        <SimpleInput
          placeholder="Last name"
          style={{ marginTop: "10px", paddingLeft: "0px" }}
          value={formData.lastName}
          onChange={(e) => {
            const inputVal = e.target.value;
            if (regex.test(inputVal) && inputVal.length <= 15) {
              setFormData({
                ...formData,
                lastName: inputVal,
              });
            }
          }}
        />
        {errors && errors.lastName && (
          <span className={styles.error}>{errors.lastName}</span>
        )}
        <SimpleInput
          placeholder="Email"
          style={{ marginTop: "10px" }}
          value={formData.email}
          type="email"
          onChange={(e) => {
            setFormData({
              ...formData,
              email: e.target.value,
            });
          }}
        />
        {errors && errors.email && (
          <span className={styles.error}>{errors.email}</span>
        )}

        <div className={styles.radioDiv}>
          <p
            className="fw-500 pt-3"
            style={{ fontSize: "14px", marginBottom: 0 }}
          >
            Please select your type of submission
          </p>
          <div className="d-flex align-items-center">
            <input
              type="radio"
              name="option"
              className="me-2"
              checked={formData.type === "QUESTION"}
              value={formData.type}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  type: "QUESTION",
                });
              }}
            />
            <label style={{ fontSize: "14px" }}>Question</label>
          </div>
          <div className="d-flex align-items-center">
            <input
              type="radio"
              name="option"
              className="me-2"
              checked={formData.type === "FEEDBACK"}
              value={formData.type}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  type: "FEEDBACK",
                });
              }}
            />
            <label style={{ fontSize: "14px" }}>General Feedback</label>
          </div>
          <div className="d-flex align-items-center">
            <input
              type="radio"
              name="option"
              className="me-2"
              checked={formData.type === "OTHER"}
              value={formData.type}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  type: "OTHER",
                });
              }}
            />
            <label style={{ fontSize: "14px" }}>Other</label>
          </div>
        </div>
        {errors && errors.type && (
          <span className={styles.error}>{errors.type}</span>
        )}

        <textarea
          rows={8}
          placeholder="Type your message here..."
          className={styles.textArea}
          value={formData.description}
          onChange={(e) => {
            setFormData({
              ...formData,
              description: e.target.value,
            });
          }}
        />
        {errors && errors.description && (
          <span className={styles.error}>{errors.description}</span>
        )}
        <div className="d-flex mt-2 mb-3 justify-content-between ">
          <div className="d-flex">
            <input
              type="checkbox"
              style={{ width: "25px", height: "15px" }}
              onChange={(e) => setSubmit(e.target.checked)}
            />
            <h4 className={styles.head1} style={{ fontSize: "12px" }}>
              I agree to the{" "}
              <span onClick={handleLinkClick}>
                <u>Terms & Conditions</u>
              </span>{" "}
              and{" "}
              <span onClick={handleLinkClick}>
                <u>Privacy Policy</u>
              </span>{" "}
            </h4>
          </div>
        </div>
        <div className="text-center">
          <Button
            type="submit"
            style={{
              width: "50%",
              fontWeight: 600,
              background: "#f8cd46",
              borderColor: "transparent",
            }}
            disabled={!submit}
            onClick={validateBasicForm}
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ContactRes;
