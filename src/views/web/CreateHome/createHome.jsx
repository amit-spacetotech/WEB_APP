import React, { useEffect, useState } from "react";
import styles from "./createHome.module.css";
import { connect } from "react-redux";
import createProfile_end from "../../../assets/createProfile/createProfile_end.json";
import createProfile_start from "../../../assets/createProfile/createProfile_start.json";
import axios from "axios";
import handleFileUpload from "@/utils/uploadImage";
import Lottie from "react-lottie";
import { useRouter } from "next/router";
import { useMediaQuery } from "react-responsive";
import { AiOutlinePlusCircle, AiOutlineMinusCircle } from "react-icons/ai";
import { DatePicker, Space } from "antd";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../../config/config";
function CreateHome(props) {
  const [formData, setFormData] = React.useState({
    bedRooms: 1,
    bathRooms: 1,
    livingrooms: 1,
    size: "",
    deposit: "",
    images: [null, null, null, null],
    rent: "",
    haveGarden: false,
    isSmokingAllowed: false,
    isPetsAllowed: false,
    isWaterIncluded: false,
    isElectricityIncluded: false,
    availableRooms: 1,
    availableFrom: "",
    minLeasePeriod: "",
    about: "",
    currencyType: "",
    tempDate: "",
  });

  const [step, setStep] = React.useState(0);

  const [loading, setLoading] = React.useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [errors, setErrors] = React.useState({});
  const router = useRouter();
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 600px)" });

  // useEffect(() => {
  //   if (isTabletOrMobile) {
  //     router.push("/createaccount");
  //   }
  // }, [isTabletOrMobile]);

  const handleRemoveImage = (indexToRemove) => {
    const updatedImages = [...formData.images];

    if (indexToRemove >= 0 && indexToRemove < updatedImages.length) {
      updatedImages[indexToRemove] = null;
      setFormData({ ...formData, images: updatedImages });
    }
  };
  const validateBasicForm = () => {
    const newErrors = {};
    const basicForm = {
      size: 0,
    };
    Object.keys(basicForm).forEach((key) => {
      if (Number(formData[key]) < 1 || !formData[key]) {
        newErrors[key] = "Please enter size greater than 0";
      }
    });

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setStep(2);
    }
  };
  const handleDateChange = (value, date) => {
    setFormData({ ...formData, availableFrom: date, tempDate: value });
  };

  const validatePricingForm = () => {
    const newErrors = {};
    const basicForm = {
      rent: "Rent",
      deposit: "Deposit",
      currencyType: "Currency type",
    };
    Object.keys(basicForm).forEach((key) => {
      if (!formData[key]) {
        newErrors[key] = `${basicForm[key]} is required`;
      }
    });

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setStep(4);
    }
  };

  const validateAvailabilityForm = () => {
    const newErrors = {};
    const basicForm = {
      availableFrom: "Available from",
      minLeasePeriod: "Minimum lease period",
    };
    Object.keys(basicForm).forEach((key) => {
      if (!formData[key]) {
        newErrors[key] = `${basicForm[key]} is required`;
      }
    });

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setStep(5);
    }
  };
  const defaultOptions1 = {
    loop: true,
    autoplay: true,
    animationData: createProfile_start,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  function handleFileSelect(event, index) {
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/gif"];
    const selectedFile = event.target.files[0];

    if (allowedTypes.includes(selectedFile.type)) {
      setErrors({ ...errors, image: "" });
      setSelectedFile(true);
      // Do something with the selected file(s)
      handleFileUpload(selectedFile).then((val) => {
        setSelectedFile(false);
        const newImages = [...formData.images];
        newImages[index] = val;

        setFormData({ ...formData, images: newImages });
      });
    } else {
      alert("Please select a valid image file (PNG, JPEG, JPG, GIF)");
    }
  }

  const check = async () => {
    await setDoc(doc(db, `userList/${props.auth && props.auth._id}`), {
      home: true,
    });
  };
  const handleCreateHome = () => {
    setLoading(true);
    axios({
      method: "post",
      url: `/home/updateHome`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      data: {
        ...formData,
        availableFrom: new Date(formData.availableFrom),
      },
    })
      .then((res) => {
        check();
        setStep(7);
        setLoading(false);
      })
      .catch((err) => {
        alert(
          err.response.data
            ? err.response.data.error
            : "OOPS! SOMETHING WENT WRONG"
        );
        // setLoading(false);
        // setError(err.response.data.error ?? err.response.data.errors[0].msg);
      });
  };
  const disabledDate = (current) => {
    // Get today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Disable if the current date is before today
    return current && current < today;
  };
  const handleIncreament = (fieldName) => {
    setFormData({ ...formData, [fieldName]: formData[fieldName] + 1 });
  };

  const handleDeacrement = (fieldName) => {
    if (formData[fieldName] > 0) {
      setFormData({ ...formData, [fieldName]: formData[fieldName] - 1 });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {step === 0 && (
          <div className={styles.profileComp}>
            <Lottie options={defaultOptions1} height={220} width={296} />
            <h2>List your home</h2>
            <p style={{ color: "#040404" }}>
              Please note that listing your property is completely free at
              <br />
              HomeShare. We only charge a success fee of 3% of your
              <br /> annual rent amount if you successfully find a housemate on
              <br />
              our platform.
            </p>
            <button onClick={() => setStep(1)}>Let's get started!</button>
            <p className={styles.pre}>
              Click{" "}
              <span
                onClick={() => {
                  router.push("/pricing");
                  props.setOpenHome(false);
                }}
              >
                here
              </span>{" "}
              for more information
            </p>
          </div>
        )}
        {step === 7 && (
          <div className={`${styles.profileComp} ${styles.end}`}>
            <Lottie options={defaultOptions1} height={220} width={330} />
            <h2>Your home is now listed</h2>
            <p>
              Please note that if you successfully find a housemate on
              <br />
              HomeShare, you will be liable for the success fee of 3%.
              <br />{" "}
              {!isTabletOrMobile && "You can click below for more information."}
            </p>
            <button
              onClick={() => {
                window.location.reload();
                window.location.replace("/property");
              }}
            >
              I understand
            </button>
          </div>
        )}
        {step !== 0 && step !== 7 && (
          <div className={styles.leftContent}>
            {[1, 2, 3, 4, 5, 6].map((val, index) => {
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
                  {val == 6 && (
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
        {step !== 0 && step !== 7 && (
          <div className={styles.rightContent}>
            {step === 1 && (
              <div className={styles.form}>
                <h2>About my home</h2>

                <div className={styles.selection}>
                  <p>Bedrooms</p>
                  <div className={styles.selector}>
                    <AiOutlineMinusCircle
                      onClick={() => {
                        formData.bedRooms > 1 && handleDeacrement("bedRooms");
                      }}
                    />
                    <h3>{formData.bedRooms}</h3>
                    <AiOutlinePlusCircle
                      onClick={() => handleIncreament("bedRooms")}
                    />
                  </div>
                </div>

                <div className={styles.selection}>
                  <p>Bathrooms</p>
                  <div className={styles.selector}>
                    <AiOutlineMinusCircle
                      onClick={() => {
                        formData.bathRooms > 1 && handleDeacrement("bathRooms");
                      }}
                    />
                    <h3>{formData.bathRooms}</h3>{" "}
                    <AiOutlinePlusCircle
                      onClick={() => handleIncreament("bathRooms")}
                    />
                  </div>
                </div>
                <div className={styles.selection}>
                  <p>Living rooms</p>
                  <div className={styles.selector}>
                    <AiOutlineMinusCircle
                      onClick={() => {
                        formData.livingrooms > 1 &&
                          handleDeacrement("livingrooms");
                      }}
                    />
                    <h3>{formData.livingrooms}</h3>
                    <AiOutlinePlusCircle
                      onClick={() => handleIncreament("livingrooms")}
                    />
                  </div>
                </div>

                <div className={styles.selection}>
                  <p>Do you have a garden?</p>
                  <div className={styles.selector}>
                    <div className={styles.selectionRadion}>
                      <input
                        type="radio"
                        value={formData.haveGarden}
                        checked={formData.haveGarden}
                        onChange={() =>
                          setFormData({ ...formData, haveGarden: true })
                        }
                      />
                      <label>Yes</label>
                    </div>
                    <div className={styles.selectionRadion}>
                      <input
                        type="radio"
                        value={formData.haveGarden}
                        checked={!formData.haveGarden}
                        onChange={() =>
                          setFormData({ ...formData, haveGarden: false })
                        }
                      />
                      <label>No</label>
                    </div>
                    <div></div>
                  </div>
                </div>

                <div className={styles.selectionInput}>
                  <label>What is the size of your property in m^2?</label>
                  <input
                    placeholder="0"
                    type="number"
                    value={formData.size}
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      if (
                        inputValue === "" ||
                        (inputValue > 0 && inputValue.length <= 7)
                      ) {
                        setFormData({ ...formData, size: e.target.value });
                      }
                    }}
                  />
                </div>
                {errors && errors.size && (
                  <span className={styles.error}>{errors.size}</span>
                )}
                <div
                  className={styles.flexComp}
                  style={{ justifyContent: "center" }}
                >
                  <button onClick={() => validateBasicForm()}>Next</button>
                </div>
              </div>
            )}

            {/* Step 2 : House Rules */}
            {step === 2 && (
              <div className={styles.form}>
                <h2>House rules</h2>

                <div className={styles.selection}>
                  <p>Pets allowed?</p>
                  <div className={styles.selector}>
                    <div className={styles.selectionRadion}>
                      <input
                        type="radio"
                        value={formData.isPetsAllowed}
                        checked={formData.isPetsAllowed}
                        onChange={() =>
                          setFormData({
                            ...formData,
                            isPetsAllowed: true,
                          })
                        }
                      />
                      <label>Yes</label>
                    </div>
                    <div className={styles.selectionRadion}>
                      <input
                        type="radio"
                        value={formData.isPetsAllowed}
                        checked={!formData.isPetsAllowed}
                        onChange={() =>
                          setFormData({
                            ...formData,
                            isPetsAllowed: false,
                          })
                        }
                      />
                      <label>No</label>
                    </div>
                    <div></div>
                  </div>
                </div>

                <div className={styles.selection}>
                  <p>Smoking allowed?</p>
                  <div className={styles.selector}>
                    <div className={styles.selectionRadion}>
                      <input
                        type="radio"
                        value={formData.isSmokingAllowed}
                        checked={formData.isSmokingAllowed}
                        onChange={() =>
                          setFormData({
                            ...formData,
                            isSmokingAllowed: true,
                          })
                        }
                      />
                      <label>Yes</label>
                    </div>
                    <div className={styles.selectionRadion}>
                      <input
                        type="radio"
                        value={formData.isSmokingAllowed}
                        checked={!formData.isSmokingAllowed}
                        onChange={() =>
                          setFormData({
                            ...formData,
                            isSmokingAllowed: false,
                          })
                        }
                      />
                      <label>No</label>
                    </div>
                  </div>
                </div>
                <div className={styles.flexComp}>
                  <span onClick={() => setStep(1)}>{"< Back"}</span>
                  <button onClick={() => setStep(3)}>Next</button>
                </div>
              </div>
            )}

            {/* Step 3 : About LifeStyle */}
            {step === 3 && (
              <div className={styles.form}>
                <h2>Pricing</h2>

                <div className={styles.flex}>
                  <div className={styles.halfWidth}>
                    <label className={styles.label}>Rent per month</label>
                    <input
                      placeholder="0"
                      type="number"
                      className={styles.fullTextField}
                      value={formData.rent}
                      onChange={(e) => {
                        const inputValue = e.target.value;
                        if (
                          inputValue === "" ||
                          (inputValue > 0 && inputValue.length <= 6)
                        ) {
                          setFormData({
                            ...formData,
                            rent: e.target.value,
                          });
                        }
                      }}
                    />
                    {errors && errors.rent && (
                      <span className={`${styles.error} ${styles.position}`}>
                        {errors.rent}
                      </span>
                    )}
                  </div>
                  <div className={styles.halfWidth}>
                    <label className={styles.label}></label>
                    <select
                      name="currencies"
                      value={formData.currencyType}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          currencyType: e.target.value,
                        });
                      }}
                    >
                      <option selected value="" disabled>
                        Select currency
                      </option>

                      {/* <option value="$">Dollar</option> */}
                      <option value="R">Rand</option>
                      {/* <option value="£">Pond</option>
                      <option value="€">Euro</option> */}
                    </select>
                    {errors && errors.currencyType && (
                      <span className={`${styles.error} ${styles.position}`}>
                        {errors.currencyType}
                      </span>
                    )}
                  </div>
                </div>

                <div className={styles.flex}>
                  <div className={styles.halfWidth}>
                    <label className={styles.label}>Deposit Required</label>
                    <input
                      placeholder="0"
                      type="number"
                      className={styles.fullTextField}
                      value={formData.deposit}
                      onChange={(e) => {
                        const inputValue = e.target.value;
                        if (
                          inputValue === "" ||
                          (inputValue > 0 && inputValue.length <= 6)
                        ) {
                          setFormData({
                            ...formData,
                            deposit: e.target.value,
                          });
                        }
                      }}
                    />
                    {errors && errors.deposit && (
                      <span className={`${styles.error} ${styles.position}`}>
                        {errors.deposit}
                      </span>
                    )}
                  </div>
                  <div className={styles.halfWidth}>
                    <label className={styles.label}></label>
                    <select
                      name="currencies"
                      value={formData.currencyType}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          currencyType: e.target.value,
                        });
                      }}
                    >
                      <option selected value="" disabled>
                        Select currency
                      </option>
                      {/* <option value="$">Dollar</option> */}
                      <option value="R">Rand</option>
                      {/* <option value="£">Pond</option>
                      <option value="€">Euro</option> */}
                    </select>
                    {errors && errors.currencyType && (
                      <span className={`${styles.error} ${styles.position}`}>
                        {errors.currencyType}
                      </span>
                    )}
                  </div>
                </div>

                <div className={styles.selection}>
                  <p>Water Included?</p>
                  <div className={styles.selector}>
                    <div className={styles.selectionRadion}>
                      <input
                        type="radio"
                        checked={formData.isWaterIncluded}
                        value={formData.isWaterIncluded}
                        onChange={(e) =>
                          setFormData({ ...formData, isWaterIncluded: true })
                        }
                      />
                      <label>Yes</label>
                    </div>
                    <div className={styles.selectionRadion}>
                      <input
                        type="radio"
                        checked={!formData.isWaterIncluded}
                        value={formData.isWaterIncluded}
                        onChange={(e) =>
                          setFormData({ ...formData, isWaterIncluded: false })
                        }
                      />
                      <label>No</label>
                    </div>
                  </div>
                </div>

                <div className={styles.selection}>
                  <p>Electricity Included?</p>
                  <div className={styles.selector}>
                    <div className={styles.selectionRadion}>
                      <input
                        type="radio"
                        checked={formData.isElectricityIncluded}
                        value={formData.isElectricityIncluded}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            isElectricityIncluded: true,
                          })
                        }
                      />
                      <label>Yes</label>
                    </div>
                    <div className={styles.selectionRadion}>
                      <input
                        type="radio"
                        checked={!formData.isElectricityIncluded}
                        value={formData.isElectricityIncluded}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            isElectricityIncluded: false,
                          })
                        }
                      />
                      <label>No</label>
                    </div>
                  </div>
                </div>
                <div className={styles.selection}>
                  <p>Internet Included?</p>
                  <div className={styles.selector}>
                    <div className={styles.selectionRadion}>
                      <input
                        type="radio"
                        checked={formData.isInternetIncluded}
                        value={formData.isInternetIncluded}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            isInternetIncluded: true,
                          })
                        }
                      />
                      <label>Yes</label>
                    </div>
                    <div className={styles.selectionRadion}>
                      <input
                        type="radio"
                        checked={!formData.isInternetIncluded}
                        value={formData.isInternetIncluded}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            isInternetIncluded: false,
                          })
                        }
                      />
                      <label>No</label>
                    </div>
                    <div></div>
                  </div>
                </div>
                <div className={styles.flexComp}>
                  <span onClick={() => setStep(2)}>{"< Back"}</span>
                  <button onClick={() => validatePricingForm()}>Next</button>
                </div>
              </div>
            )}

            {/* Step 4 Your Interest */}
            {step === 4 && (
              <div className={styles.form}>
                <h2>Availability</h2>

                <div className={styles.selection}>
                  <p>No. of available rooms</p>
                  <div className={styles.selector}>
                    <AiOutlineMinusCircle
                      onClick={() => {
                        formData.availableFrom > 1 &&
                          handleDeacrement("availableRooms");
                      }}
                    />
                    <h3>{formData.availableRooms}</h3>{" "}
                    <AiOutlinePlusCircle
                      onClick={() => handleIncreament("availableRooms")}
                    />
                  </div>
                </div>

                <div className={styles.selectionWithInput}>
                  <p>Available from</p>
                  <div className={styles.selectionInput}>
                    <DatePicker
                      disabledDate={disabledDate}
                      className="homeDate"
                      format="YYYY-MM-DD"
                      style={{ zIndex: 1050 }}
                      inputReadOnly
                      value={formData.tempDate}
                      onChange={handleDateChange}
                      placeholder="Select date"
                    />
                    {/* <input
                      type="date"
                      value={formData.availableFrom}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          availableFrom: e.target.value,
                        })
                      }
                    /> */}
                  </div>
                </div>
                {errors && errors.availableFrom && (
                  <span className={`${styles.error} ${styles.position}`}>
                    {errors.availableFrom}
                  </span>
                )}

                <div className={styles.selectionWithInput}>
                  <p>Minimum lease period</p>
                  <div className={styles.selectionInput}>
                    <input
                      type="number"
                      placeholder="0 months"
                      value={formData.minLeasePeriod}
                      onChange={(e) => {
                        const inputValue = e.target.value;
                        if (
                          inputValue === "" ||
                          (inputValue > 0 && inputValue.length <= 2)
                        ) {
                          setFormData({
                            ...formData,
                            minLeasePeriod: e.target.value,
                          });
                        }
                      }}
                    />
                  </div>
                </div>
                {errors && errors.minLeasePeriod && (
                  <span className={`${styles.error} ${styles.position}`}>
                    {errors.minLeasePeriod}
                  </span>
                )}

                <div className={styles.flexComp}>
                  <span onClick={() => setStep(3)}>{"< Back"}</span>
                  <button onClick={() => validateAvailabilityForm()}>
                    Next
                  </button>
                </div>
              </div>
            )}
            {/* Step 5 :Photo Time */}
            {step === 5 && (
              <div className={styles.form}>
                <h2 className={styles.uploadH2}>Upload home pictures</h2>
                <p>
                  Upload at least 4 pictures of your home. The better the
                  quality of your photos , the easier you'll find a housemate.
                </p>

                <div className={styles.photosFlex}>
                  <div className={styles.leftPhoto}>
                    <div className={styles.upload_box}>
                      <label htmlFor="file-input-0">
                        {formData.images.length > 0 && formData.images[0] ? (
                          <img src={formData.images[0]} alt="Selected file" />
                        ) : (
                          <span>+</span>
                        )}
                      </label>
                      <input
                        id="file-input-0"
                        type="file"
                        style={{
                          opacity: 0,
                          width: "100%",
                          position: "absolute",
                        }}
                        onChange={(e) => handleFileSelect(e, 0)}
                      />
                    </div>
                  </div>
                  <div className={styles.rightPhoto}>
                    <div className={styles.upload_box}>
                      {formData.images[1] && (
                        <svg
                          onClick={() => handleRemoveImage(1)}
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
                      <label htmlFor="file-input-1">
                        {formData.images.length > 0 && formData.images[1] ? (
                          <img src={formData.images[1]} alt="Selected file" />
                        ) : (
                          <span>+</span>
                        )}
                      </label>
                      <input
                        id="file-input-1"
                        type="file"
                        style={{
                          opacity: 0,
                          width: "100%",
                          position: "absolute",
                        }}
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
                      <label htmlFor="file-input-2">
                        {formData.images.length > 0 && formData.images[2] ? (
                          <img src={formData.images[2]} alt="Selected file" />
                        ) : (
                          <span>+</span>
                        )}
                      </label>
                      <input
                        id="file-input-2"
                        type="file"
                        style={{
                          opacity: 0,
                          width: "100%",
                          position: "absolute",
                        }}
                        onChange={(e) => handleFileSelect(e, 2)}
                      />
                    </div>
                    <div className={styles.upload_box}>
                      {formData.images[3] && (
                        <svg
                          onClick={() => handleRemoveImage(3)}
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
                      <label htmlFor="file-input-3">
                        {formData.images.length > 0 && formData.images[3] ? (
                          <img src={formData.images[3]} alt="Selected file" />
                        ) : (
                          <span>+</span>
                        )}
                      </label>
                      <input
                        id="file-input-3"
                        type="file"
                        style={{
                          opacity: 0,
                          width: "100%",
                          position: "absolute",
                        }}
                        onChange={(e) => handleFileSelect(e, 3)}
                      />
                    </div>
                  </div>
                </div>
                {selectedFile && (
                  <span className={styles.error}>
                    *Image uploading please wait
                  </span>
                )}

                {errors && errors.image && (
                  <span className={styles.error}>{errors.image}</span>
                )}

                <div className={styles.flexComp}>
                  <span onClick={() => setStep(4)}>{"< Back"}</span>
                  <button
                    onClick={() => {
                      if (formData.images[0]) {
                        setStep(6);
                      } else {
                        setErrors({ image: "Please upload main image" });
                      }
                    }}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {step === 6 && (
              <div className={styles.form}>
                <h2 className={styles.uploadH2}>Tell us more</h2>
                <h4 style={{ marginTop: "0.1rem" }}>
                  Anything else you would like to share about your home?
                </h4>
                <textarea
                  value={formData.about}
                  onChange={(e) =>
                    setFormData({ ...formData, about: e.target.value })
                  }
                  type="text"
                  className={styles.description}
                  placeholder="Time to tell your potential housemate how incredible your place is..."
                />
                {errors && errors.about && (
                  <span className={styles.error}>{errors.about}</span>
                )}
                <div className={styles.flexComp}>
                  <span onClick={() => setStep(5)}>{"< Back"}</span>
                  <button
                    onClick={() => {
                      formData.about
                        ? handleCreateHome()
                        : setErrors({ ...errors, about: "Field is required" });
                    }}
                  >
                    Done
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
    auth: state.auth.user,
  };
};

export default connect(mapStateToProps, null)(CreateHome);
