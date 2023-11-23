import SimpleInput from "@/components/common/simpleInput";
import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import styles from "./contact.module.css";
import axios from "axios";
import { useRouter } from "next/router";

function Contact() {
  const router = useRouter();

  const [errors, setErrors] = React.useState({});

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    type: "",
    description: "",
    agreeTerm:false
  });

  const validateEmail = (email) => {
    const pattern = /^\S+[\w.-]*@[\w.-]+\.\w+$/;

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
    })
      .then((res) => {
     
        alert("Submitted Successfully");
      
        setFormData({
          ...formData,
          firstName: "",
          lastName: "",
          email: "",
          type: "",
          description: "",
          agreeTerm:false
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const regex = /^[a-zA-Z\s]*$/;
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
  return (
    <div className={styles.container}>
      <div className={styles.content1}>
        <h4 className={styles.head1}>
          We would <span>love to hear</span>
          <br /> from you{" "}
        </h4>
      </div>
      <div className={styles.divider}></div>
      <div className={styles.content2}>
        <h4>Contact Us</h4>
        <SimpleInput
          type="text"
          placeholder="First Name"
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
          placeholder="Last Name"
          style={{ marginTop: "10px" }}
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
        <div className="pt-3">
          <p className="fw-700">Please select your type of submission:</p>
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
            <label>Question</label>
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
            <label>General Feedback</label>
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
            <label>Other</label>
          </div>
        </div>
        {errors && errors.type && (
          <span className={styles.error}>{errors.type}</span>
        )}

        <textarea
          rows={8}
          placeholder="Type your message here..."
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
          <div className={styles.flex} style={{ alignItems: "center" }}>
            <input
              type="checkbox"
              checked={formData.agreeTerm}
              value={formData.agreeTerm}
              onChange={() => {
                setFormData({...formData,agreeTerm:!formData.agreeTerm})}
              }
              style={{ width: "25px", height: "18px", marginRight: "0.2rem" }}
            />
            <p>
              I agree to the{" "}
              <span onClick={handleLinkClick} style={{ cursor: "pointer" }}>
                <u> terms & conditions</u>
              </span>{" "}
              and{" "}
              <span onClick={handleLinkClick} style={{ cursor: "pointer" }}>
                <u> privacy policy</u>
              </span>{" "}
            </p>
          </div>
        </div>
        <div className="text-center">
          <Button
            disabled={!formData.agreeTerm}
            type="submit"
          
            style={{
              opacity: `${formData.agreeTerm ? 1 : 0.5}`,
              width: "20%",

              padding: "10px 0",
              background: "#f8cd46",
              borderColor: "transparent",
            }}
            onClick={validateBasicForm}
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Contact;
