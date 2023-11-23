import React, { useEffect, useState } from "react";
import styles from "./createProfile.module.css";

import createProfile_end from "../../../assets/createProfile/createProfile_end.json";
import createProfile_start from "../../../assets/createProfile/createProfile_start.json";
import axios from "axios";
import handleFileUpload from "@/utils/uploadImage";
import Lottie from "react-lottie";
import { useRouter } from "next/router";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { useMediaQuery } from "react-responsive";
import moment from "moment";
import { Button, Modal, Select } from "antd";
import Facecam from "./faceCam";
import { DatePicker, Space } from "antd";
import { getCities } from "@/redux/actions/contentAction";
import { connect } from "react-redux";
function CreateProfile(props) {
  const [formData, setFormData] = React.useState({
    firstName: "",
    lastName: "",
    gender: "",
    dob: "",
    location: "Location",
    images: [null, null, null],
    rentalBudget: "",
    currency: "",
    havePets: false,
    peopleCapacity: "",
    religion: "",
    interest: [],
    about: "",
    isVerified: true,
    tempDate: false,
  });
  const [cities, setCities] = React.useState([]);
  const [step, setStep] = React.useState(0);
  const [faceDetected, setFaceDetected] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [errors, setErrors] = React.useState({});
  const router = useRouter();
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 600px)" });
  const handleChangeLocation = (value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      location: value,
    }));
  };
  const handleRemoveImage = (indexToRemove) => {
    const updatedImages = [...formData.images];

    if (indexToRemove >= 0 && indexToRemove < updatedImages.length) {
      updatedImages[indexToRemove] = null;
      setFormData({ ...formData, images: updatedImages });
    }
  };
  useEffect(() => {
    if (isTabletOrMobile) {
      router.push("/createaccount");
    }
  }, [isTabletOrMobile]);

  function toCamelCase(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }
  const handleChange = (value) => {
    setFormData({ ...formData, gender: value });
  };
  React.useEffect(() => {
    if (cities.length < 1 || !cities) {
      const allCity =
        props.cities &&
        props.cities.map((city) => ({
          value: city,
          label: city,
        }));
      setCities(allCity);
    }
  }, [props.cities, cities]);

  useEffect(() => {
    if (!props.cities) {
      props.getCities();
    }
  }, []);

  const validateBasicForm = () => {
    const newErrors = {};
    const basicForm = {
      firstName: "",
      lastName: "",
      gender: "",
      dob: "",
      location: "",
    };
    const errorMessage = {
      firstName: "First name",
      lastName: "Last name",
      gender: "Gender",
      dob: "Date of birth",
      location: "Location",
    };
    Object.keys(basicForm).forEach((key) => {
      if (!formData[key]) {
        newErrors[key] = `${errorMessage[key]} is required`;
      }
    });

    if (
      formData.dob &&
      new Date(formData.dob) > new Date(moment().subtract(18, "years"))
    ) {
      setErrors({ ...errors, dob: "Minimum age is 18" });
      newErrors["dob"] = "Minimum age is 18";
    }
    if (formData.location && formData.location === "Location") {
      setErrors({ ...errors, location: "Location field is required" });
      newErrors["location"] = "Location field is required";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setStep(2);
    }
  };

  const handleDateChange = (value, date) => {
    setFormData({ ...formData, dob: date, tempDate: value });
  };
  const validateLifeStyleForm = () => {
    const newErrors = {};
    const basicForm = {
      rentalBudget: "",
      currency: "",
      peopleCapacity: "",
      religion: "",
      location: "",
    };
    const errorMessage = {
      rentalBudget: "Rental budget",
      currency: "Currency",
      peopleCapacity: "People capacity",
      religion: "Religion",
    };
    Object.keys(basicForm).forEach((key) => {
      if (!formData[key]) {
        newErrors[key] = `${errorMessage[key]} is required`;
      }
    });

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setStep(4);
    }
  };

  const validateInterestForm = () => {
    const newErrors = {};
    const basicForm = {
      interest: "",
      about: "",
    };
    Object.keys(basicForm).forEach((key) => {
      if (key === "about" ? !formData[key] : formData[key].length < 1) {
        newErrors[key] = `${toCamelCase(
          key === "about" ? "Description" : "Interest"
        )} is required`;
      }
    });

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setStep(5);
    }
  };
  const handleInterestChange = (interest) => {
    if (formData.interest.includes(interest)) {
      // If interest already exists, remove it from the array
      setFormData({
        ...formData,
        interest: formData.interest.filter((item) => item !== interest),
      });
    } else {
      // If interest doesn't exist, add it to the array
      setFormData({
        ...formData,
        interest: [...formData.interest, interest],
      });
    }
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: createProfile_end,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const defaultOptions1 = {
    loop: true,
    autoplay: true,
    animationData: createProfile_start,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  React.useEffect(() => {
    setStep(step);
  }, [step]);

  function handleFileSelect(event, index) {
    const selectedFile = event.target.files[0];
    setSelectedFile(true);
    setErrors({ ...errors, images: "" });
    // Do something with the selected file(s)
    handleFileUpload(selectedFile).then((val) => {
      setSelectedFile(false);
      const newImages = [...formData.images];
      newImages[index] = val;

      setFormData({ ...formData, images: newImages });
    });
  }

  const handleCreateProfile = () => {
    setLoading(true);
    axios({
      method: "put",
      url: `/user/updateUserProfile`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      data: { ...formData },
    })
      .then((res) => {
        props.setStep(6);
        setStep(6);
        setLoading(false);
      })
      .catch((err) => {
        alert(
          err.response.data
            ? err.response.data.error
            : "OOPS! SOMETHING WENT WRONG"
        );
      });
  };

  const interestArr = [
    "Art",
    "Cooking",
    "Dancing",
    "Gym",
    "Music",
    "Languages",
    "Reading",
    "Hiking",
    "Sports",
    "History",
    "Travel",
  ];

  const info = () => {
    Modal.info({
      title: "This is a notification message",
      content: (
        <div style={{ zIndex: "200000" }}>
          <p>some messages...some messages...</p>
          <p>some messages...some messages...</p>
        </div>
      ),
      onOk() {},
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Modal title="Basic Modal" open={false}>
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
        </Modal>

        {step === 0 && (
          <div className={styles.profileComp}>
            <Lottie options={defaultOptions1} height={350} width={340} />
            <h2>Create your profile</h2>

            <p
              style={{
                fontSize: "12px",
                margin: "20px",
                fontFamily: "Poppins",
                lineHeight: "20px",
                fontWeight: "500",
              }}
            >
              You don't have any profile yet. Please create <br />
              your profile to view this information.
            </p>
            <button
              style={{
                fontWeight: "500",
                fontFamily: "Poppins",
                marginTop: "20px",
              }}
              onClick={() => setStep(1)}
            >
              Let's get started!
            </button>
          </div>
        )}

        {step === 6 && (
          <div className={`${styles.profileComp} ${styles.end}`}>
            <Lottie options={defaultOptions} height={350} width={340} />
            <h2>Profile created successfully</h2>
            {/* style={{lineHeight:"80%",border:"1px solid red"}} */}
            <p>
              Your profile has been successfully created <br />
              You can now interact with other users.
            </p>
            <button
              onClick={() => {
                router.push("/").then(() => {
                  window.location.reload();
                });
              }}
            >
              Get Started
            </button>
          </div>
        )}
        {step !== 0 && step !== 6 && (
          <div className={styles.leftContent}>
            {[1, 2, 3, 4, 5].map((val, index) => {
              return (
                <>
                  <div className={styles.line} key={index} />

                  <h2
                    className={`${step === val && styles.activeStep} ${
                      step > val && styles.completedStep
                    } ${step < val && styles.inActiveStep}`}
                  >
                    {val}
                  </h2>
                  {val == 5 && (
                    <div
                      className={`${styles.line} ${styles.lastLine}`}
                      key={6}
                    />
                  )}
                </>
              );
            })}
          </div>
        )}
        {step !== 0 && step !== 6 && (
          <div className={styles.rightContent}>
            {step === 1 && (
              <div className={styles.form}>
                <h2 className={styles.equalSpace}>Basic Details</h2>

                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => {
                    const regex = /^[a-zA-Z]*$/;
                    if (regex.test(e.target.value)) {
                      if (e.target.value.length <= 15) {
                        setFormData({ ...formData, firstName: e.target.value });
                      }
                    }
                  }}
                  max="15"
                  className={styles.fullTextField}
                  placeholder="First Name"
                />
                {errors && errors.firstName && (
                  <span className={styles.error}>*{errors.firstName}</span>
                )}
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => {
                    const regex = /^[a-zA-Z]*$/; // regular expression to match alphabets only
                    if (regex.test(e.target.value)) {
                      if (e.target.value.length <= 15) {
                        setFormData({ ...formData, lastName: e.target.value });
                      }
                    }
                  }}
                  className={styles.fullTextField}
                  placeholder="Last Name"
                />
                {errors && errors.lastName && (
                  <span className={styles.error}>*{errors.lastName}</span>
                )}

                <DatePicker
                  className="dateProfileWeb"
                  format="YYYY-MM-DD"
                  inputReadOnly
                  value={formData.tempDate}
                  onChange={handleDateChange}
                  placeholder="Birthday"
                />
                {/* <input
                  value={formData.dob}
                  onChange={(e) =>
                    setFormData({ ...formData, dob: e.target.value })
                  }
                  className={styles.fullTextField}
                  type="date"
                  placeholder="Birthday"
                /> */}
                {errors && errors.dob && (
                  <span className={styles.error}>*{errors.dob}</span>
                )}

                <Select
                  defaultValue={formData.gender ? formData.gender : null}
                  placeholder="Gender"
                  className={`profileSelect mobileSelect ${
                    formData.gender && "genderColorChange"
                  }`}
                  style={{
                    color: `${formData.gender ? "black" : "#8b8b8b"}`,
                    marginBottom: "0.5rem",
                  }}
                  onChange={handleChange}
                  options={[
                    {
                      label: "Male",
                      value: "Male",
                    },
                    {
                      label: "Female",
                      value: "Female",
                    },
                    {
                      label: "Others",
                      value: "Others",
                    },
                  ]}
                />
                {errors && errors.gender && (
                  <span className={styles.error}>*{errors.gender}</span>
                )}
                <Select
                  value={formData.location}
                  onChange={handleChangeLocation}
                  className={`profileSelect ${
                    formData.location === "Location" && "colorChangeSelect"
                  }`}
                  style={{
                    color: `${
                      formData.location !== "Location" ? "black" : "#8b8b8b"
                    }`,
                  }}
                  showSearch
                  placeholder="Location"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.label.toLowerCase().includes(input.toLowerCase())
                  }
                  options={cities}
                  dropdownStyle={{
                    maxHeight: "150px",
                    overflowY: "scroll",
                    paddingBottom: "10px",
                  }}
                />

                {errors && errors.location && (
                  <span className={styles.error}>*{errors.location}</span>
                )}
                <div
                  className={styles.flexComp}
                  style={{ justifyContent: "center" }}
                >
                  <button onClick={() => validateBasicForm()}>Next</button>
                </div>
              </div>
            )}

            {/* Step 2 : PHOTO UPLOAD */}
            {step === 2 && (
              <div className={styles.form}>
                <h2>Its photo time!</h2>
                <p className={styles.equalSpace}>
                  Add some photos of yourself. Make sure your face is visible &
                  that your photos tell a story of who you are.
                </p>
                {selectedFile && (
                  <span className={styles.error}>
                    *Image uploading please wait
                  </span>
                )}
                {errors && errors.images && (
                  <span className={styles.error}>*{errors.images}</span>
                )}

                <div className={styles.photosFlex}>
                  <div className={styles.leftPhoto}>
                    <div className={styles.upload_box}>
                      <label htmlFor={`file-input-0`}>
                        {formData.images[0] ? (
                          <img src={formData.images[0]} alt="Selected file" />
                        ) : (
                          <span>
                            <AiOutlinePlusCircle />
                          </span>
                        )}
                      </label>
                      <input
                        id={`file-input-0`}
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(e) => handleFileSelect(e, 0)}
                      />
                    </div>
                  </div>
                  <div className={styles.rightPhoto}>
                    <div className={styles.upload_box}>
                      {formData.images[1] && (
                        <svg
                          className={styles.crossIconSM}
                          onClick={() => handleRemoveImage(1)}
                          xmlns="http://www.w3.org/2000/svg"
                          width="36.532"
                          height="36.532"
                          viewBox="0 0 36.532 36.532"
                        >
                          <path
                            d="M18.266,0A18.266,18.266,0,1,0,36.532,18.266,18.286,18.286,0,0,0,18.266,0Zm0,0"
                            fill="#f44336"
                          />
                          <path
                            d="M169.371,167.218a1.522,1.522,0,1,1-2.153,2.153l-4.574-4.574-4.574,4.574a1.522,1.522,0,1,1-2.153-2.153l4.574-4.574-4.574-4.574a1.522,1.522,0,1,1,2.153-2.153l4.574,4.574,4.574-4.574a1.522,1.522,0,0,1,2.153,2.153l-4.574,4.574Zm0,0"
                            transform="translate(-144.378 -144.378)"
                            fill="#fafafa"
                          />
                        </svg>
                      )}
                      <label htmlFor={`file-input-1`}>
                        {formData.images[1] ? (
                          <img src={formData.images[1]} alt="Selected file" />
                        ) : (
                          <span>
                            <AiOutlinePlusCircle />
                          </span>
                        )}
                      </label>
                      <input
                        id={`file-input-1`}
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(e) => handleFileSelect(e, 1)}
                      />
                    </div>
                    <div className={styles.upload_box}>
                      {formData.images[2] && (
                        <svg
                          onClick={() => handleRemoveImage(2)}
                          className={styles.crossIconSM}
                          xmlns="http://www.w3.org/2000/svg"
                          width="36.532"
                          height="36.532"
                          viewBox="0 0 36.532 36.532"
                        >
                          <path
                            d="M18.266,0A18.266,18.266,0,1,0,36.532,18.266,18.286,18.286,0,0,0,18.266,0Zm0,0"
                            fill="#f44336"
                          />
                          <path
                            d="M169.371,167.218a1.522,1.522,0,1,1-2.153,2.153l-4.574-4.574-4.574,4.574a1.522,1.522,0,1,1-2.153-2.153l4.574-4.574-4.574-4.574a1.522,1.522,0,1,1,2.153-2.153l4.574,4.574,4.574-4.574a1.522,1.522,0,0,1,2.153,2.153l-4.574,4.574Zm0,0"
                            transform="translate(-144.378 -144.378)"
                            fill="#fafafa"
                          />
                        </svg>
                      )}
                      <label htmlFor={`file-input-2`}>
                        {formData.images[2] ? (
                          <img src={formData.images[2]} alt="Selected file" />
                        ) : (
                          <span>
                            <AiOutlinePlusCircle />
                          </span>
                        )}
                      </label>
                      <input
                        id={`file-input-2`}
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(e) => handleFileSelect(e, 2)}
                      />
                    </div>
                  </div>
                </div>

                <div className={styles.flexComp}>
                  <span onClick={() => setStep(1)}>{"< Back"}</span>
                  <button
                    onClick={() => {
                      if (!formData.images[0]) {
                        setErrors({
                          images: "Please upload main image",
                        });
                      } else {
                        setStep(3);
                      }
                    }}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* Step 3 : About LifeStyle */}
            {step === 3 && (
              <div className={styles.form}>
                <h2 style={{ marginBottom: "0.9rem" }}>About your lifestyle</h2>

                <div className={styles.flex}>
                  <div className={styles.halfWidth}>
                    <label className={styles.label}>
                      Monthly Rental Budget
                    </label>
                    <input
                      placeholder="0"
                      type="number"
                      max={6}
                      maxLength="6"
                      className={styles.fullTextField}
                      value={formData.rentalBudget}
                      onChange={(e) => {
                        const inputValue = e.target.value;
                        if (
                          inputValue === "" ||
                          (inputValue > 0 && inputValue.length <= 6)
                        ) {
                          setFormData({
                            ...formData,
                            rentalBudget: e.target.value,
                          });
                        }
                      }}
                    />
                    {errors && errors.rentalBudget && (
                      <span className={styles.error}>
                        *{errors.rentalBudget}
                      </span>
                    )}
                  </div>
                  <div className={styles.halfWidth}>
                    <label className={styles.label}></label>
                    <select
                      name="currencies"
                      style={{
                        color: `${formData.currency ? "black" : "#8b8b8b"}`,
                      }}
                      value={formData.currency}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          currency: e.target.value,
                        });
                      }}
                    >
                      <option selected value="">
                        Select currency
                      </option>
                      {/* <option value="$">Dollar</option> */}
                      <option value="R">Rand</option>
                      {/* <option value="£">Pond</option>
                      <option value="€">Euro</option> */}
                    </select>
                    {errors && errors.currency && (
                      <span className={styles.error}>*{errors.currency}</span>
                    )}
                  </div>
                </div>

                <div className={styles.equalMargin}>
                  <label className={styles.label}>Do you have pets?</label>
                  <div className={styles.flex}>
                    <div
                      className={`${styles.flex} ${styles.equalMargin}`}
                      style={{ alignItems: "center" }}
                    >
                      <input
                        type="radio"
                        checked={formData.havePets}
                        value={formData.havePets}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            havePets: true,
                          });
                        }}
                      />
                      <label className={styles.label}>Yes</label>
                    </div>
                    <div
                      className={`${styles.flex} ${styles.equalMargin}`}
                      style={{ alignItems: "center" }}
                    >
                      <input
                        type="radio"
                        checked={!formData.havePets}
                        value={formData.havePets}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            havePets: false,
                          });
                        }}
                      />
                      <label className={styles.label}>No</label>
                    </div>
                    <div className={styles.flex}></div>
                  </div>
                </div>

                <div className={styles.equalMargin}>
                  <label className={styles.label}>
                    What is your capacity for people?
                  </label>

                  <div
                    className={`${styles.flex} ${styles.lessMargin}`}
                    style={{ alignItems: "center" }}
                  >
                    <div
                      className={styles.flex}
                      style={{ alignItems: "center" }}
                    >
                      <input
                        type="radio"
                        checked={formData.peopleCapacity === "Introvert"}
                        value={formData.peopleCapacity}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            peopleCapacity: "Introvert",
                          });
                        }}
                      />
                      <label className={styles.label}>Introvert</label>
                    </div>
                    <div
                      className={`${styles.flex} ${styles.equalMargin}`}
                      style={{ alignItems: "center" }}
                    >
                      <input
                        type="radio"
                        checked={formData.peopleCapacity === "Extrovert"}
                        value={formData.peopleCapacity}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            peopleCapacity: "Extrovert",
                          });
                        }}
                      />
                      <label className={styles.label}> Extrovert</label>
                    </div>
                    <div
                      className={`${styles.flex} ${styles.equalMargin}`}
                      style={{ alignItems: "center" }}
                    >
                      <input
                        type="radio"
                        checked={formData.peopleCapacity === "Ambivert"}
                        value={formData.peopleCapacity}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            peopleCapacity: "Ambivert",
                          });
                        }}
                      />
                      <label className={styles.label}>Ambivert</label>
                    </div>
                  </div>
                  {errors && errors.peopleCapacity && (
                    <span className={styles.error}>
                      *{errors.peopleCapacity}
                    </span>
                  )}
                </div>

                <div style={{ margin: "0.5rem 0" }}>
                  <label className={styles.label}>
                    Do you identify with a specific religion?
                  </label>

                  <select
                    name="religion"
                    value={formData.religion}
                    style={{
                      color: `${formData.religion ? "black" : "#8b8b8b"}`,
                    }}
                    onChange={(e) =>
                      setFormData({ ...formData, religion: e.target.value })
                    }
                  >
                    <option value="" selected="selected" disabled="disabled">
                      Select
                    </option>
                    <option value="No">No</option>
                    <option value="Buddhist">Buddhist</option>
                    <option value="Christian">Christian</option>
                    <option value="Hindu">Hindu</option>
                    <option value="Jewish">Jewish</option>
                    <option value="Muslim">Muslim</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors && errors.religion && (
                    <span className={styles.error}>*{errors.religion}</span>
                  )}
                </div>
                <div className={styles.flexComp}>
                  <span onClick={() => setStep(2)}>{"< Back"}</span>
                  <button onClick={() => validateLifeStyleForm()}>Next</button>
                </div>
              </div>
            )}

            {/* Step 4 Your Interest */}
            {step === 4 && (
              <div className={styles.form}>
                <h2 style={{ marginBottom: "0.9rem" }}>Your Interests</h2>

                <div className={styles.equalMargin}>
                  {" "}
                  <label className={`${styles.label} ${styles.lessMargin}`}>
                    {" "}
                    What are your interests?
                  </label>
                  <div className={styles.interestFlex}>
                    {interestArr.map((val, index) => {
                      return (
                        <div
                          className={`${styles.interest} ${
                            formData.interest.includes(val) &&
                            styles.activeInterest
                          }`}
                          key={index}
                          onClick={() => handleInterestChange(val)}
                        >
                          <p>{val}</p>
                        </div>
                      );
                    })}
                  </div>
                  {errors && errors.interest && (
                    <span className={styles.error}>*{errors.interest}</span>
                  )}
                </div>

                <div className={styles.equalMargin}>
                  <label className={`${styles.label} ${styles.lessMargin}`}>
                    {" "}
                    Anything else you would like to add?
                  </label>
                  <textarea
                    value={formData.about}
                    onChange={(e) => {
                      if (e.target.value.length <= 200) {
                        setFormData({ ...formData, about: e.target.value });
                      }
                    }}
                    type="text"
                    className={styles.description}
                    placeholder="Do you have any additional information you would  like to 
                 add? Write a brief summary here."
                  />
                  {errors && errors.about && (
                    <span className={styles.error}>*{errors.about}</span>
                  )}
                </div>
                <div className={styles.flexComp}>
                  <span onClick={() => setStep(3)}>{"< Back"}</span>
                  <button onClick={() => validateInterestForm()}>Next</button>
                </div>
              </div>
            )}
            {/* Step 5 :Face verification */}
            {step === 5 && (
              <div className={styles.form}>
                <h2>Identity Verification</h2>
                <p>
                  To ensure the safety of our users, we are required to verify
                  your identity
                </p>
                <div style={{ textAlign: "center" }}>
                  <Facecam
                    setErrors={setErrors}
                    errors={errors}
                    setFaceDetected={setFaceDetected}
                  />
                  {errors && errors.detection && (
                    <span className={styles.error}>*{errors.detection}</span>
                  )}
                </div>

                <div className={styles.flexComp}>
                  <span onClick={() => setStep(4)}>{"< Back"}</span>
                  <button
                    onClick={() =>
                      !faceDetected
                        ? setErrors({
                            ...errors,
                            detection: "Verification is required",
                          })
                        : handleCreateProfile()
                    }
                    disabled={loading}
                  >
                    {loading ? "...Creating profile" : "Next"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    cities: state.content.cities,
  };
};

export default connect(mapStateToProps, {
  getCities,
})(CreateProfile);
