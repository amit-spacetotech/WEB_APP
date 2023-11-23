import React from "react";
import styles from "./style.module.css";
import NoHomeImg from "../../../assets/img/noHome.png";
import { BiRupee } from "react-icons/bi";
import { MdLocationOn, MdVerifiedUser } from "react-icons/md";
import { FaMoneyBillAlt, FaRegEdit } from "react-icons/fa";
import dynamic from "next/dynamic";
import { Button } from "react-bootstrap";
import { useRouter } from "next/router";
import { connect } from "react-redux";
import AppLoader from "@/utils/AppLoader/AppLoader";
import axios from "axios";
import { MdFavorite, MdOutlineFavoriteBorder } from "react-icons/md";
import {
  getFavorites,
  getHouseMates,
  getSingleUser,
  getUser,
} from "@/redux/actions/auth";
import { IoIosArrowBack } from "react-icons/io";
import CommonModal from "@/components/common/modal";
import moment from "moment";
import handleFileUpload from "@/utils/uploadImage";
import { Select } from "antd";
import { getCities } from "@/redux/actions/contentAction";
import { useMediaQuery } from "react-responsive";
const ProfileImg = dynamic(() => import("@/components/common/profile"), {
  ssr: false,
});

function MyProfile({ card = false, ...props }) {
  const router = useRouter();
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 700px)" });
  const [formData, setFormData] = React.useState({});
  const [updating, setUpdating] = React.useState();
  const [cities, setCities] = React.useState([]);
  const [profileImg, setProfileImg] = React.useState(false);
  const [favoritesList, setFavoritesList] = React.useState([]);
  const [errors, setErrors] = React.useState();
  const [data, setData] = React.useState({
    user: false,
    home: false,
    userid: false,
  });
  const [edit, setEdit] = React.useState({
    open: false,
    field: [],
    userData: false,
    homeData: false,
  });
  const [selectedFile, setSelectedFile] = React.useState(null);

  function handleProfFileSelect(event, index) {
    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/gif",
      "image/heif",
    ];
    const selectedFile = event.target.files[0];

    if (allowedTypes.includes(selectedFile.type)) {
      setErrors({ ...errors, image: "" });
      setSelectedFile(true);
      // Do something with the selected file(s)
      handleFileUpload(selectedFile).then((val) => {
        setSelectedFile(false);
        const newImages = [...edit.userData.images];

        newImages[index] = val;

        setEdit((prevData) => ({
          ...prevData,
          userData: {
            ...prevData.userData,
            images: newImages,
          },
        }));
      });
    } else {
      alert("Please select a valid image file (PNG, JPEG, JPG, GIF)");
    }
  }
  function handleFileSelect(event, index) {
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/gif"];
    const selectedFile = event.target.files[0];

    if (allowedTypes.includes(selectedFile.type)) {
      setErrors({ ...errors, image: "" });
      setSelectedFile(true);
      // Do something with the selected file(s)
      handleFileUpload(selectedFile).then((val) => {
        setSelectedFile(false);
        const newImages = [...edit.homeData.images];
        newImages[index] = val;

        setEdit((prevData) => ({
          ...prevData,
          homeData: {
            ...prevData.homeData,
            images: newImages,
          },
        }));
      });
    } else {
      alert("Please select a valid image file (PNG, JPEG, JPG, GIF)");
    }
  }

  React.useEffect(() => {
    if (!props.cities) {
      props.getCities();
    }
  }, []);
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
  React.useEffect(() => {
    if (favoritesList.length <= 0 && props.userFavorites) {
      setFavoritesList(props.userFavorites);
    }
  }, [props.userFavorites]);
  React.useEffect(() => {
    if (!props.auth && !props.auth.userProfile) {
      router.push("/");
    }
  }, []);
  const validate = () => {
    const newErrors = {};
    const errorMessage = {
      firstName: "First name",
      lastName: "Last name",
      gender: "Gender",
      dob: "Date of birth",
      location: "Location",
      rentalBudget: "Rental budget",
      currency: "Currency",
      peopleCapacity: "People capacity",
      religion: "Religion",
    };
    edit.field.forEach((key) => {
      if (
        !edit.userData[key] &&
        key !== "property" &&
        key !== "havePets" &&
        key !== "profilePhoto"
      ) {
        newErrors[key] = `${errorMessage[key]} is required`;
      }
    });

    if (
      edit.field.includes("dob") &&
      new Date(edit.userData.dob) > new Date(moment().subtract(18, "years"))
    ) {
      setErrors({ ...errors, dob: "Minimum age is 18" });
      newErrors["dob"] = "Minimum age is 18";
    }
    if (edit.field.includes("interest") && edit.userData.interest.length < 1) {
      setErrors({ ...errors, interest: "Interest is required" });
      newErrors["dob"] = "Interest is required";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setErrors("");
      return true;
    }
  };
  console.log(errors);

  const getSingleMate = () => {
    axios({
      method: "get",
      url: `/utils/getSingleMate?_id=${router.query._id}`,
      basic: true,
      headers: {
        "Content-Type": "Application/json",
        Authorization:
          "Basic SE9NRVNIQVJFOlJBTkRPTUhPTUVTSEFSRVBBU1NXT1JEUE9JVVlUUkVRV0VSVFlVSQ==",
      },
    })
      .then((res) => {
        setEdit({
          ...edit,
          userData: res.data.userDetails,
          homeData: res.data.userDetails.userhomedetail,
        });
        setData({
          ...data,
          user: res.data.userDetails,
          home: res.data.userDetails.userhomedetail,
          userid: res.data.userDetails.userId,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  React.useState(() => {
    if (!router.query._id) {
      setData({
        ...data,
        user: props.auth.userProfile,
        home: props.home.userProperty,
      });
      setEdit({
        ...edit,
        userData: props.auth.userProfile,
        homeData: props.home.userProperty,
      });
    }
    if (router.query._id) {
      getSingleMate();
      props.getFavorites("userProfile");
    }
  }, [props.auth, router.query]);

  const addHomeFavorite = (_id) => {
    let newObject = { userProfileId: router.query._id };
    setFavoritesList((prevArray) => [...prevArray, newObject]);
    axios({
      method: "post",
      url: `/favorites/addFavorites`,
      basic: true,
      headers: {
        "Content-Type": "Application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      data: { userProfileId: router.query._id },
    })
      .then((res) => {
        props.getFavorites("userProfile");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deleteProfileFavorite = (_id) => {
    const updatedArray = favoritesList.filter(
      (obj) => obj.userProfileId !== router.query._id
    );
    setFavoritesList(updatedArray);
    axios({
      method: "delete",
      url: `/favorites/removeFavorite`,
      basic: true,
      headers: {
        "Content-Type": "Application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      data: { userProfileId: router.query._id },
    })
      .then((res) => {
        props.getFavorites("userProfile");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const checkAge = () => {
    const dateOfBirthString = data.user && data.user?.dob;
    const dateOfBirth = new Date(dateOfBirthString);
    const today = new Date();

    let age = today.getFullYear() - dateOfBirth.getFullYear();
    const monthDiff = today.getMonth() - dateOfBirth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())
    ) {
      age--;
    }
    return age;
  };
  function toCamelCase(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  const filteredArray =
    data.user &&
    data.user.images &&
    data.user.images.filter((item) => item !== null);

  const filteredHomeArray =
    data.home &&
    data.home.images &&
    data.home.images.filter((item) => item !== null);

  const handleCreateHome = () => {
    setUpdating(true);
    axios({
      method: "post",
      url: `/home/updateHome`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      data: {
        homeId: edit.homeData._id,
        ...edit.homeData,
        availableFrom: new Date(edit.homeData.availableFrom),
      },
    })
      .then((res) => {
        // homeDetails
        setUpdating(false);
        setData({
          ...data,
          user: props.auth.userProfile,
          home: res.data.homeDetails,
        });
        props.getSingleUser();
        setEdit({ ...edit, open: false });
      })
      .catch((err) => {
        setUpdating(false);
        alert(
          err.response.data
            ? err.response.data.error
            : "OOPS! SOMETHING WENT WRONG"
        );
        // setLoading(false);
        // setError(err.response.data.error ?? err.response.data.errors[0].msg);
      });
  };

  const handleCreateProfile = () => {
    if (validate()) {
      setUpdating(true);
      axios({
        method: "put",
        url: `/user/updateUserProfile`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        data: { ...edit.userData },
      })
        .then((res) => {
          setUpdating(false);
          setData({
            ...data,
            user: res.data.userProfile,
            home: props.home.userProperty,
          });
          props.getSingleUser();
          setEdit({ ...edit, open: false });
          // window.location.reload();
        })
        .catch((err) => {
          setUpdating(false);
          console.log(err);
          alert(
            err.response && err.response.data
              ? err.response.data.error
              : "OOPS! SOMETHING WENT WRONG"
          );
          // setLoading(false);
          // setError(err.response.data.error ?? err.response.data.errors[0].msg);
        });
    }
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
  function toCamelCase(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  function checkUserProfileIdExists() {
    return (
      favoritesList &&
      favoritesList.some(
        (obj) => obj.userProfileId === router.query._id && router.query._id
      )
    );
  }

  const handleInterestChange = (interest) => {
    if (edit.userData.interest.includes(interest)) {
      // If interest already exists, remove it from the array
      setEdit((prevData) => ({
        ...prevData,
        userData: {
          ...prevData.userData,
          interest: edit.userData.interest.filter((item) => item !== interest),
        },
      }));
    } else {
      // If interest doesn't exist, add it to the array
      setEdit((prevData) => ({
        ...prevData,
        userData: {
          ...prevData.userData,
          interest: [...edit.userData.interest, interest],
        },
      }));
    }
  };

  return (
    <div className={styles.container}>
      {!data.user && <AppLoader />}
      {props.auth && !props.auth.userProfile && (
        <p>Please create your Profile</p>
      )}
      {profileImg && (
        <ProfileImg
          setShow={() => setProfileImg(false)}
          show={profileImg}
          images={filteredArray}
        />
      )}
      <CommonModal
        className="auth"
        show={edit.open}
        setShow={() => {
          setEdit({
            ...edit,
            userData: props.auth.userProfile,
            homeData: props.home.userProperty,
            open: false,
          });
        }}
        bodyContent={
          <div className={styles.updateModel}>
            {edit.field.length > 0 && edit.field.includes("firstName") && (
              <input
                type="text"
                value={edit.userData.firstName}
                className={styles.fullTextField}
                onChange={(e) => {
                  const regex = /^[a-zA-Z]*$/;
                  if (
                    regex.test(e.target.value) &&
                    e.target.value.length <= 15
                  ) {
                    setEdit((prevData) => ({
                      ...prevData,
                      userData: {
                        ...prevData.userData,
                        firstName: e.target.value,
                      },
                    }));
                  }
                }}
              />
            )}
            {edit.field.includes("firstName") && errors && errors.firstName && (
              <span className={styles.error}>*{errors.firstName}</span>
            )}

            {edit.field.length > 0 && edit.field.includes("lastName") && (
              <input
                type="text"
                value={edit.userData.lastName}
                className={styles.fullTextField}
                onChange={(e) => {
                  const regex = /^[a-zA-Z]*$/;
                  if (
                    regex.test(e.target.value) &&
                    e.target.value.length <= 15
                  ) {
                    setEdit((prevData) => ({
                      ...prevData,
                      userData: {
                        ...prevData.userData,
                        lastName: e.target.value,
                      },
                    }));
                  }
                }}
              />
            )}
            {edit.field.includes("lastName") && errors && errors.lastName && (
              <span className={styles.error}>*{errors.lastName}</span>
            )}
            {edit.field.includes("gender") &&
              edit.field.length > 0 &&
              edit.field.includes("gender") && (
                <select
                  value={edit.userData.gender}
                  style={{
                    color: `${edit.userData.gender ? "black" : "#8b8b8b"}`,
                  }}
                  onChange={(e) =>
                    setEdit((prevData) => ({
                      ...prevData,
                      userData: {
                        ...prevData.userData,
                        gender: e.target.value,
                      },
                    }))
                  }
                >
                  <option value="" disabled>
                    Gender
                  </option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Others">Others</option>
                </select>
              )}
            {errors && errors.gender && (
              <span className={styles.error}>*{errors.gender}</span>
            )}
            {edit.field.length > 0 && edit.field.includes("location") && (
              <Select
                value={edit.userData.location}
                onChange={(e) =>
                  setEdit((prevData) => ({
                    ...prevData,
                    userData: {
                      ...prevData.userData,
                      location: e,
                    },
                  }))
                }
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
            )}
            {edit.field.length > 0 && edit.field.includes("rentalBudget") && (
              <input
                type="text"
                className={styles.fullTextField}
                placeholder="Rental budget"
                value={
                  edit.userData &&
                  (edit.homeData && edit.homeData.rent
                    ? edit.homeData.rent
                    : edit.userData.rentalBudget)
                }
                onChange={(e) => {
                  const inputValue = e.target.value;
                  if (
                    inputValue === "" ||
                    (inputValue > 0 && inputValue.length <= 6)
                  ) {
                    if (data.home && data.home.rent) {
                      setEdit((prevData) => ({
                        ...prevData,
                        homeData: {
                          ...prevData.homeData,
                          rent: inputValue,
                        },
                      }));
                    } else {
                      setEdit((prevData) => ({
                        ...prevData,
                        userData: {
                          ...prevData.userData,
                          rentalBudget: inputValue,
                        },
                      }));
                    }
                  }
                }}
              />
            )}
            {errors && errors.rentalBudget && (
              <span className={styles.error}>*{errors.rentalBudget}</span>
            )}
            {edit.field.length > 0 && edit.field.includes("havePets") && (
              <div className={styles.equalMargin}>
                <label className={styles.label}>Do you have pets?</label>
                <div className={styles.flex}>
                  <div
                    className={`${styles.flex} ${styles.equalMargin}`}
                    style={{ alignItems: "center" }}
                  >
                    <input
                      type="radio"
                      checked={edit.userData.havePets}
                      value={edit.userData.havePets}
                      onChange={(e) =>
                        setEdit((prevData) => ({
                          ...prevData,
                          userData: {
                            ...prevData.userData,
                            havePets: true,
                          },
                        }))
                      }
                    />
                    <label className={styles.labelOption}>Yes</label>
                  </div>
                  <div
                    className={`${styles.flex} ${styles.equalMargin}`}
                    style={{ alignItems: "center" }}
                  >
                    <input
                      type="radio"
                      checked={!edit.userData.havePets}
                      value={edit.userData.havePets}
                      onChange={(e) =>
                        setEdit((prevData) => ({
                          ...prevData,
                          userData: {
                            ...prevData.userData,
                            havePets: false,
                          },
                        }))
                      }
                    />
                    <label className={styles.labelOption}>No</label>
                  </div>
                  <div className={styles.flex}></div>
                </div>
              </div>
            )}

            {edit.field.length > 0 && edit.field.includes("about") && (
              <textarea
                type="text"
                rows={4}
                className={styles.aboutSec}
                placeholder="Description"
                value={edit.userData.about}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  if (inputValue.length <= 200) {
                    setEdit((prevData) => ({
                      ...prevData,
                      userData: {
                        ...prevData.userData,
                        about: inputValue,
                      },
                    }));
                  }
                }}
              />
            )}
            {errors && errors.about && (
              <span className={styles.error}>*{errors.about}</span>
            )}
            {edit.field.length > 0 && edit.field.includes("dob") && (
              <input
                type="date"
                value={edit.userData.dob}
                className={styles.fullTextField}
                onMouseDown={(e) => {
                  // Check if the user agent is an iOS device
                  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

                  // Prevent default only for non-iOS devices
                  if (!isIOS) {
                    e.preventDefault();
                  }
                }}
                style={{
                  WebkitAppearance:
                    "none" /* Remove default styling for Safari */,
                  appearance:
                    "none" /* Remove default styling for other browsers */,
                  backgroundColor:
                    "transparent" /* Set background color to transparent */,

                  outline: "none" /* Remove the blue outline on focus */,
                  color: "black" /* Use the inherited text color */,
                }}
                onChange={(e) =>
                  setEdit((prevData) => ({
                    ...prevData,
                    userData: {
                      ...prevData.userData,
                      dob: e.target.value,
                    },
                  }))
                }
              />
            )}
            {errors && errors.dob && (
              <span className={styles.error}>*{errors.dob}</span>
            )}
            {edit.field.length > 0 && edit.field.includes("religion") && (
              <select
                name="religion"
                value={edit.userData.religion}
                style={{
                  color: `${edit.userData.religion ? "black" : "#8b8b8b"}`,
                }}
                onChange={(e) =>
                  setEdit((prevData) => ({
                    ...prevData,
                    userData: {
                      ...prevData.userData,
                      religion: e.target.value,
                    },
                  }))
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
            )}
            {edit.field.length > 0 && edit.field.includes("interest") && (
              <div className={styles.interestFlex}>
                {interestArr.map((val, index) => {
                  return (
                    <div
                      className={`${styles.interest} ${
                        edit.userData.interest.includes(val) &&
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
            )}
            {errors && errors.interest && (
              <span className={styles.error}>*{errors.interest}</span>
            )}
            {edit.field.length > 0 && edit.field.includes("property") && (
              <div className={styles.photosFlex}>
                <div className={styles.leftPhoto}>
                  <div className={styles.upload_box}>
                    <label htmlFor="file-input-0">
                      {edit.homeData.images.length > 0 &&
                      edit.homeData.images[0] ? (
                        <img
                          src={edit.homeData.images[0]}
                          alt="Selected file"
                        />
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
                    <label htmlFor="file-input-1">
                      {edit.homeData.images.length > 0 &&
                      edit.homeData.images[1] ? (
                        <img
                          src={edit.homeData.images[1]}
                          alt="Selected file"
                        />
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
                    <label htmlFor="file-input-2">
                      {edit.homeData.images.length > 0 &&
                      edit.homeData.images[2] ? (
                        <img
                          src={edit.homeData.images[2]}
                          alt="Selected file"
                        />
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
                    <label htmlFor="file-input-3">
                      {edit.homeData.images.length > 0 &&
                      edit.homeData.images[3] ? (
                        <img
                          src={edit.homeData.images[3]}
                          alt="Selected file"
                        />
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
            )}

            {edit.field.length > 0 && edit.field.includes("profilePhoto") && (
              <div className={styles.photosFlex}>
                <div className={styles.leftPhoto}>
                  <div className={styles.upload_box}>
                    <label htmlFor="file-input-0">
                      {edit.userData.images.length > 0 &&
                      edit.userData.images[0] ? (
                        <img
                          src={edit.userData.images[0]}
                          alt="Selected file"
                        />
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
                      onChange={(e) => handleProfFileSelect(e, 0)}
                    />
                  </div>
                </div>
                <div className={styles.rightPhoto}>
                  <div className={`${styles.upload_box} ${styles.box2}`}>
                    <label htmlFor="file-input-1">
                      {edit.userData.images.length > 0 &&
                      edit.userData.images[1] ? (
                        <img
                          src={edit.userData.images[1]}
                          alt="Selected file"
                        />
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
                      onChange={(e) => handleProfFileSelect(e, 1)}
                    />
                  </div>
                  <div className={`${styles.upload_box} ${styles.box2}`}>
                    <label htmlFor="file-input-2">
                      {edit.userData.images.length > 0 &&
                      edit.userData.images[2] ? (
                        <img
                          src={edit.userData.images[2]}
                          alt="Selected file"
                        />
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
                      onChange={(e) => handleProfFileSelect(e, 2)}
                    />
                  </div>
                </div>
              </div>
            )}
            {selectedFile && (
              <span className={styles.error}>*Image uploading please wait</span>
            )}
            <button
              onClick={() => {
                edit.field.includes("property") ||
                (edit.field.includes("rentalBudget") &&
                  data.home &&
                  data.home.rent)
                  ? handleCreateHome()
                  : handleCreateProfile();
              }}
            >
              {updating ? "Updating..." : "Update"}
            </button>
          </div>
        }
      />
      {console.log(edit, "EDIT")}

      {data.user && (
        <>
          <div className={styles.leftContent}>
            <div className={styles.imageSection}>
              <div className={styles.mainImage}>
                <div
                  className={styles.mobileBack}
                  onClick={() => {
                    router.push("/");
                    props.getHouseMates(1, 9, "");
                  }}
                >
                  <IoIosArrowBack fontSize="1.25rem" cursor="pointer" />
                </div>
                {!router.query._id && (
                  <div className={styles.profileSvg}>
                    <FaRegEdit
                      color="#ffffff"
                      cursor="pointer"
                      onClick={() =>
                        setEdit({
                          ...edit,
                          field: ["profilePhoto"],
                          open: true,
                        })
                      }
                    />
                  </div>
                )}
                {router.query._id && router.query._id && (
                  <div
                    className={
                      checkUserProfileIdExists()
                        ? styles.activeFavorite
                        : styles.favoriteBg
                    }
                  >
                    {checkUserProfileIdExists() ? (
                      <MdFavorite
                        color="red"
                        onClick={() => deleteProfileFavorite()}
                      />
                    ) : (
                      <MdOutlineFavoriteBorder
                        color="#5B5B5B"
                        onClick={() => addHomeFavorite()}
                      />
                    )}
                  </div>
                )}
                <img
                  onClick={() => setProfileImg(true)}
                  src={data.user?.images?.length > 0 && data.user?.images[0]}
                  alt="Image"
                  style={{ cursor: "pointer" }}
                />
              </div>

              <div className={styles.rightImage}>
                <div style={{ position: "relative" }}>
                  {!router.query._id &&
                    data.user &&
                    data.user?.images.length > 1 &&
                    data.user.images[1] && (
                      <div className={styles.profileSvg}>
                        <FaRegEdit
                          color="#ffffff"
                          cursor="pointer"
                          onClick={() =>
                            setEdit({
                              ...edit,
                              field: ["profilePhoto"],
                              open: true,
                            })
                          }
                        />
                      </div>
                    )}
                  {data.user &&
                    data.user.images[1] &&
                    data.user?.images.length > 0 && (
                      <img src={data.user?.images[1]} alt="homeshare" />
                    )}
                </div>
                <div style={{ position: "relative" }}>
                  {!router.query._id &&
                    data.user &&
                    data.user?.images.length > 1 &&
                    data.user.images[2] && (
                      <div className={styles.profileSvg}>
                        <FaRegEdit
                          color="#ffffff"
                          cursor="pointer"
                          onClick={() =>
                            setEdit({
                              ...edit,
                              field: ["profilePhoto"],
                              open: true,
                            })
                          }
                        />
                      </div>
                    )}
                  {data.user &&
                    data.user?.images.length > 1 &&
                    data.user?.images[2] && (
                      <img src={data.user?.images[2]} alt="homeshare" />
                    )}
                </div>
              </div>
            </div>

            <div className={styles.profile}>
              <div
                className={`${styles.flexComp} ${styles.flexJustifySpace} ${styles.detail}`}
              >
                <div className={`${styles.flexComp} `}>
                  <h3 className="d-flex align-center">
                    {data.user &&
                      toCamelCase(data.user?.firstName) +
                        " " +
                        toCamelCase(data.user.lastName)}
                    , {data.user && checkAge()}
                    <MdVerifiedUser
                      color="#3BD600"
                      style={{ marginLeft: "0.3rem" }}
                    />
                  </h3>
                  {!router.query._id && (
                    <FaRegEdit
                      color="#B3B3B3"
                      size="0.8rem"
                      cursor="pointer"
                      onClick={() =>
                        setEdit({
                          ...edit,
                          field: ["firstName", "lastName", "dob"],
                          open: true,
                        })
                      }
                    />
                  )}
                </div>
                {(!isTabletOrMobile || router.query._id) && (
                  <div className={`${styles.flexComp} ${styles.rentalBudget}`}>
                    {/* <FaMoneyBillAlt color="#02870B" /> */}
                    <p>
                      {data.user && data.user.currency} &nbsp;
                      {data.user &&
                        (data.home && data.home.rent
                          ? data.home.rent
                          : data.user.rentalBudget)}
                      /month
                    </p>
                    {!router.query._id && (
                      <FaRegEdit
                        color="#B3B3B3"
                        cursor="pointer"
                        size="0.8rem"
                        onClick={() =>
                          setEdit({
                            ...edit,
                            field: ["rentalBudget"],
                            open: true,
                          })
                        }
                      />
                    )}
                  </div>
                )}
              </div>
              <div className={styles.flexComp}>
                <MdLocationOn color="#606060" />
                <p>{data.user && data.user?.location}</p>
                {!router.query._id && (
                  <FaRegEdit
                    color="#B3B3B3"
                    cursor="pointer"
                    size="0.8rem"
                    onClick={() =>
                      setEdit({
                        ...edit,
                        field: ["location"],
                        open: true,
                      })
                    }
                  />
                )}
              </div>
            </div>

            <hr />

            <div className={styles.description}>
              <h4 className={`${styles.flexComp} ${styles.spaceBelow}`}>
                Description{" "}
                {!router.query._id && (
                  <FaRegEdit
                    color="#B3B3B3"
                    cursor="pointer"
                    size="1rem"
                    onClick={() =>
                      setEdit({
                        ...edit,
                        field: ["about"],
                        open: true,
                      })
                    }
                  />
                )}
              </h4>
              <p style={{ maxWidth: "90%" }}>{data.user && data.user?.about}</p>
            </div>

            <hr />

            <div className={styles.description}>
              <h4 className={styles.flexComp}>
                Gender{" "}
                {!router.query._id && (
                  <FaRegEdit
                    color="#B3B3B3"
                    cursor="pointer"
                    size="1rem"
                    onClick={() =>
                      setEdit({
                        ...edit,
                        field: ["gender"],
                        open: true,
                      })
                    }
                  />
                )}
              </h4>
              <p>{data.user && data.user?.gender}</p>
            </div>

            <div className={styles.about}>
              <h4 className={`${styles.flexComp} ${styles.spaceBelow}`}>
                About &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                {!router.query._id && (
                  <FaRegEdit
                    color="#B3B3B3"
                    cursor="pointer"
                    size="1rem"
                    onClick={() =>
                      setEdit({
                        ...edit,
                        field: ["havePets", "religion", "interest"],
                        open: true,
                      })
                    }
                  />
                )}
              </h4>
              <div className={styles.table}>
                <p style={{ fontWeight: 500 }}>Pets :</p>
                <p>{data.user && data.user?.havePets ? "Yes" : "No"}</p>

                <p style={{ fontWeight: 500 }}>Religion :</p>
                <p>{data.user && data.user?.religion}</p>

                <p style={{ fontWeight: 500 }}>Interests :</p>
                <p style={{ width: "100vh" }}>
                  {data.user && data.user?.interest.join(", ")}
                </p>
              </div>
            </div>
          </div>
          <div className={styles.rightContent}>
            {data.home && (
              <>
                <h4 className={`${styles.flexComp} ${styles.urProp}`}>
                  {router.query._id ? "This user has a home" : "Your Property"}{" "}
                  {!router.query._id && (
                    <FaRegEdit
                      color="#B3B3B3"
                      size="0.85rem"
                      cursor="pointer"
                      onClick={() =>
                        setEdit({
                          ...edit,
                          field: ["property"],
                          open: true,
                        })
                      }
                    />
                  )}
                </h4>
                <div className={styles.propertySection}>
                  <img
                    src={
                      data.home && data.home.images[0] && data.home.images[0]
                    }
                    alt="homeshare"
                  />
                  <div className={styles.more}>
                    {filteredHomeArray.slice(1).length > 0
                      ? "+" + filteredHomeArray.slice(1).length
                      : "No other"}
                    <br />
                    photos
                  </div>

                  <div className={styles.aboutProperty}>
                    <p className={styles.flexComp}>
                      {" "}
                      <MdLocationOn size={20} color="#606060" />{" "}
                      {data.user && data.user?.location}
                    </p>
                    <p className={styles.flexComp}>
                      {" "}
                      <span>{data.home && data.home.currencyType}</span>{" "}
                      {console.log(data)}
                      {data.user &&
                        (data.home && data.home.rent
                          ? data.home.rent
                          : data.user.rentalBudget)}
                      /month
                    </p>
                  </div>
                </div>
                {router.query._id && (
                  <p
                    onClick={() =>
                      router.push(`/matehome?_id=${data.home._id}`)
                    }
                    className={styles.viewProp}
                  >
                    {" "}
                    View this property
                  </p>
                )}
                {router.query._id && (
                  <Button
                    variant="contained"
                    className={styles.send}
                    onClick={() => {
                      router.push(
                        `/messages?userId=${data?.userid}&firstName=${
                          data?.user?.firstName
                        }&lastName=${data?.user?.lastName}&img=${
                          data.user &&
                          data.user.images[0] &&
                          data.user.images[0]
                        }`
                      );
                    }}
                  >
                    Send message
                  </Button>
                )}
              </>
            )}

            {!data.home && router.query._id && (
              <div className={styles.noHome}>
                <img src={NoHomeImg.src} alt="Img" />
                <div className={styles.noHomeRight}>
                  <h4>
                    <span>
                      {data.user &&
                        data?.user?.firstName &&
                        toCamelCase(data?.user?.firstName)}
                    </span>{" "}
                    does not have a home listed!
                  </h4>
                  <Button
                    variant="contained"
                    className={styles.send}
                    onClick={() =>
                      router.push(
                        `/messages?userId=${data?.userid}&firstName=${
                          data?.user?.firstName
                        }&lastName=${data?.user?.lastName}&img=${
                          data.user &&
                          data.user.images[0] &&
                          data.user.images[0]
                        }`
                      )
                    }
                  >
                    Send Message
                  </Button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth.user,
    home: state.auth,
    userFavorites: state.auth.userFavorites,
    cities: state.content.cities,
  };
};

export default connect(mapStateToProps, {
  getFavorites,
  getHouseMates,
  getSingleUser,
  getUser,
  getCities,
})(MyProfile);
