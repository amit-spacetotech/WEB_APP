import React from "react";
import styles from "./style.module.css";
import ProfileCard from "@/components/profileCard";
import handleFileUpload from "@/utils/uploadImage";
import { MdLocationOn } from "react-icons/md";
import NewImg from "../../../assets/profile/Group 5532.png";
import { Button } from "react-bootstrap";
import { connect } from "react-redux";
import {
  getFavorites,
  getHouseMates,
  getMoveIn,
  getUser,
} from "@/redux/actions/auth";
import { Select } from "antd";
import { useRouter } from "next/router";
import AppLoader from "@/utils/AppLoader/AppLoader";
import { getCities } from "@/redux/actions/contentAction";
import moment from "moment";
import { checkAge } from "@/utils/checkAge";
import { useMediaQuery } from "react-responsive";
import { MdVerifiedUser } from "react-icons/md";
import CommonModal from "@/components/common/modal";
import Lottie from "react-lottie";

import createProfile_end from "../../../assets/createProfile/createProfile_end.json";
import axios from "axios";
import {
  addDoc,
  doc,
  getDoc,
  collection,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../../config/config";
import { FaRegEdit } from "react-icons/fa";
import { AiOutlinePlusCircle, AiOutlineMinusCircle } from "react-icons/ai";
function Property(props) {
  const router = useRouter();
  const [errors, setErrors] = React.useState();
  const [edit, setEdit] = React.useState({
    open: false,
    field: [],
    userData: false,
    homeData: false,
    updateLoader: false,
  });
  const [cities, setCities] = React.useState([]);
  const [data, setData] = React.useState({
    user: false,
    home: false,
    userId: false,
    moveIn: false,
  });
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [favoritesList, setFavoritesList] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [openMoveIn, setOpenMoveIn] = React.useState(false);
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: createProfile_end,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  let id = null;
  if (typeof window !== "undefined") {
    const queryParams = new URLSearchParams(window.location.search);
    id = queryParams.get("_id");
  }

  React.useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.push("/");
    }
  }, []);

  const handleMoveIn = () => {
    axios({
      method: "post",
      url: `/moveIn/addMoveIns`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      data: {
        ownerId: data.home.userId,
        intiatedBy: props.user._id,
        moveInStatus: "REQUESTED",
      },
    })
      .then((res) => {
        props.getMoveIn(data.home.userId, props.auth.user._id);
      })
      .catch((err) => {});
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

  const fetchSingleUserDetails = async (id1, id2) => {
    if (!props.user) return; // Exit early if props.user is falsy
    const userChatListRef = collection(db, "userchatlist");
    const userInfoDocRef = doc(userChatListRef, id1, "userInfo", id2);
    const docSnapshot = await getDoc(userInfoDocRef);
    if (docSnapshot.exists()) {
      const userInfoData = docSnapshot.data();
      return userInfoData;
    }
  };

  const saveCustomDocumentId = async (customId) => {
    try {
      let recieverData = await fetchSingleUserDetails(
        data?.home?.userId,
        props.user._id
      );

      let senderData = await fetchSingleUserDetails(
        data?.home?.userId,
        props.user._id
      );

      if (recieverData) {
        await updateDoc(
          doc(
            db,
            `userchatlist/${data.home.userId}/userInfo/${props.user._id}`
          ),
          {
            moveIn: "GOT-REQUEST",
            msgCount: recieverData.msgCount ? recieverData.msgCount + 1 : 1,
          }
        );
      }

      if (senderData) {
        await updateDoc(
          doc(
            db,
            `userchatlist/${props.user._id}/userInfo/${data.home.userId}`
          ),
          {
            moveIn: "REQUESTED",
            msgCount: senderData.msgCount ? senderData.msgCount + 1 : 1,
          }
        );
      }

      if (!senderData) {
        await setDoc(
          doc(
            db,
            `userchatlist/${props.user._id}/userInfo/${data.home.userId}`
          ),
          {
            firstName: data?.user?.firstName,
            img: data?.user?.images[0],
            userId: data?.home?.userId,
            moveIn: "REQUESTED",
            msgCount: 1,
            lastMessage: "Move in request",
          }
        );
      }

      if (!recieverData) {
        await setDoc(
          doc(
            db,
            `userchatlist/${data.home.userId}/userInfo/${props.user._id}`
          ),
          {
            firstName: props.user?.userProfile?.firstName,
            img: props.user?.userProfile?.images[0],
            userId: props.user?._id,
            moveIn: "GOT-REQUEST",
            msgCount: 1,
            lastMessage: "Recieved Move in request",
          }
        );
      }

      await addDoc(
        collection(
          db,
          `chats/${props?.user?._id}/chatUsers/${data.home.userId}/messages`
        ),
        {
          msg: "",
          request: "SENT",
          msgSeen: false,
          timestamp: new Date().toISOString(),
        }
      );

      await addDoc(
        collection(
          db,
          `chats/${data.home.userId}/chatUsers/${props.user._id}/messages`
        ),
        {
          msg: "",
          request: "RECIEVED",
          msgSeen: false,
          timestamp: new Date().toISOString(),
        }
      );
      handleMoveIn();
      setOpenMoveIn(true);
      setLoading(false);
    } catch (error) {
      console.error("Error saving custom ID document: ", error);
    }
  };
  const validate = () => {
    const newErrors = {};
    const errorMessage = {
      firstName: "First name",

      rentalBudget: "Rental budget",
      rentalBudget: "Rent",
    };
    edit.field.forEach((key) => {
      if (
        !edit.userData[key] &&
        key !== "things" &&
        key !== "rules" &&
        key !== "propertyPic"
      ) {
        newErrors[key] = `${errorMessage[key]} is required`;
      }
    });

    // if (
    //   edit.field.includes("dob") &&
    //   new Date(edit.userData.dob) > new Date(moment().subtract(18, "years"))
    // ) {
    //   setErrors({ ...errors, dob: "Minimum age is 18" });
    //   newErrors["dob"] = "Minimum age is 18";
    // }

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setEdit({ ...edit, updateLoader: true });
      setErrors("");
      return true;
    }
  };
  const validateHome = () => {
    const newErrors = {};
    const errorMessage = {
      rentalBudget: "Rent",
      deposit: "Deposit",
      size: "Size",
      minLeasePeriod: "Minimum lease period",
    };
    edit.field.forEach((key) => {
      if (
        !edit.homeData[key == "rentalBudget" ? "rent" : key] &&
        key !== "pricing" &&
        key !== "propertyPic" &&
        key !== "property" &&
        key !== "things" &&
        key !== "rules" &&
        key !== "Availabilty"
      ) {
        newErrors[key] = `${errorMessage[key]} is required`;
      }
    });
    if (edit.field.includes("property") && Number(edit.homeData.size) < 1) {
      setErrors({ ...errors, rentalBudget: "Size is required" });
      newErrors["size"] = "Size is required";
    }
    if (edit.field.includes("pricing") && Number(edit.homeData.rent) < 1) {
      setErrors({ ...errors, rentalBudget: "Rent is required" });
      newErrors["rentalBudget"] = "Rent is required";
    }

    if (edit.field.includes("pricing") && Number(edit.homeData.deposit) < 1) {
      setErrors({ ...errors, deposit: "Rent is required" });
      newErrors["deposit"] = "Deposit is required";
    }
    if (
      edit.field.includes("Availabilty") &&
      Number(edit.homeData.minLeasePeriod < 1)
    ) {
      setErrors({
        ...errors,
        minLeasePeriod: "Minimum lease period is required",
      });
      newErrors["minLeasePeriod"] = "Minimum lease period is required";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setEdit({ ...edit, updateLoader: true });
      setErrors("");
      return true;
    }
  };

  const handleCreateProfile = () => {
    if (validate()) {
      setEdit({ ...edit, updateLoader: true });
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
          setEdit({ ...edit, open: false });
          setEdit({ ...edit, updateLoader: false });
          window.location.reload();
        })
        .catch((err) => {
          setEdit({ ...edit, updateLoader: false });
          alert(
            err.response.data
              ? err.response.data.error
              : "OOPS! SOMETHING WENT WRONG"
          );
          // setLoading(false);
          // setError(err.response.data.error ?? err.response.data.errors[0].msg);
        });
    }
  };

  const handleCreateHome = () => {
    if (validateHome()) {
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
          setEdit({ ...edit, open: false });
          setEdit({ ...edit, updateLoader: false });
          window.location.reload();
        })
        .catch((err) => {
          setEdit({ ...edit, updateLoader: false });
          alert(
            err.response.data
              ? err.response.data.error
              : "OOPS! SOMETHING WENT WRONG"
          );
          // setLoading(false);
          // setError(err.response.data.error ?? err.response.data.errors[0].msg);
        });
    }
  };

  const handleIncreament = (fieldName) => {
    setEdit((prevData) => ({
      ...prevData,
      homeData: {
        ...prevData.homeData,
        [fieldName]: prevData.homeData[fieldName] + 1,
      },
    }));
  };

  const handleDeacrement = (fieldName) => {
    if (edit.homeData[fieldName] > 0) {
      setEdit((prevData) => ({
        ...prevData,
        homeData: {
          ...prevData.homeData,
          [fieldName]: prevData.homeData[fieldName] - 1,
        },
      }));
    }
  };

  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 600px)" });
  const getSingleHome = () => {
    axios({
      method: "get",
      url: `/home/getHomeDetails?_id=${id}`,
      basic: true,
      headers: {
        "Content-Type": "Application/json",
        Authorization:
          "Basic SE9NRVNIQVJFOlJBTkRPTUhPTUVTSEFSRVBBU1NXT1JEUE9JVVlUUkVRV0VSVFlVSQ==",
      },
    })
      .then((res) => {
        setData({
          ...data,
          user: res.data.homeDetails.userProfile,
          home: res.data.homeDetails,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  function DateSplit(inputDate) {
    const dateParts = inputDate.split("-");
    const date = new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`);
    const formattedDate = `${date.getDate()}-${date.toLocaleString("en-US", {
      month: "short",
    })}-${date.getFullYear()}`;
    return formattedDate;
  }
  function toCamelCase(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  React.useEffect(() => {
    if (!id && !data.home) {
      setData((prevData) => ({
        ...prevData,
        home: props.auth.userProperty,
        user: props.user.userProfile,
      }));
      setEdit((prevEdit) => ({
        ...prevEdit,
        homeData: props.auth.userProperty,
        userData: props.user.userProfile,
      }));
    }
  }, [data]);

  React.useEffect(() => {
    if (id && !data.home) {
      getSingleHome();
    }
  }, [router.query, props.auth, data.home]);

  React.useEffect(() => {
    if (
      data.home &&
      data.home.userId &&
      props.auth.user._id &&
      !data.moveIn &&
      id
    ) {
      props.getMoveIn(data.home.userId, props.auth.user._id);
    }
  }, [props.auth.user, data]);
  React.useEffect(() => {
    setData({ ...data, moveIn: props.auth.moveIn });
  }, [props.auth.moveIn]);

  const addHomeFavorite = (_id) => {
    let newObject = { homeId: _id };
    setFavoritesList((prevArray) => [...prevArray, newObject]);
    axios({
      method: "post",
      url: `/favorites/addFavorites`,
      basic: true,
      headers: {
        "Content-Type": "Application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      data: { homeId: _id },
    })
      .then((res) => {
        props.getFavorites("home");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deleteHomeFavorite = (_id) => {
    const updatedArray = favoritesList.filter((obj) => obj.homeId !== _id);
    setFavoritesList(updatedArray);
    axios({
      method: "delete",
      url: `/favorites/removeFavorite`,
      basic: true,
      headers: {
        "Content-Type": "Application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      data: { homeId: _id },
    })
      .then((res) => {
        props.getFavorites("home");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className={styles.container}>
      <CommonModal
        className="auth"
        show={edit.open}
        setShow={() => {
          setEdit({
            ...edit,
            homeData: props.auth.userProperty,
            userData: props.user.userProfile,
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
                  const regex = /^[a-zA-Z]*$/; // regular expression to match alphabets only
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

            {edit.field.length > 0 && edit.field.includes("propertyPic") && (
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
            {selectedFile && (
              <span className={styles.error}>*Image uploading please wait</span>
            )}
            {edit.field.includes("firstName") && errors && errors.firstName && (
              <span className={styles.error}>*{errors.firstName}</span>
            )}
            {/* {edit.field.length > 0 && edit.field.includes("dob") && (
              <input
                type="date"
                value={edit.userData.dob}
                className={styles.fullTextField}
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
            )} */}
            {edit.field.length > 0 && edit.field.includes("rentalBudget") && (
              <input
                type="text"
                className={styles.fullTextField}
                placeholder="Rental budget"
                value={edit.homeData.rent}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  if (
                    inputValue === "" ||
                    (inputValue > 0 && inputValue.length <= 6)
                  ) {
                    setEdit((prevData) => ({
                      ...prevData,
                      homeData: {
                        ...prevData.homeData,
                        rent: inputValue,
                      },
                    }));
                  }
                }}
              />
            )}
            {edit.field.includes("rentalBudget") &&
              errors &&
              errors.rentalBudget && (
                <span className={styles.error}>*{errors.rentalBudget}</span>
              )}
            {edit.field.length > 0 && edit.field.includes("deposit") && (
              <input
                type="text"
                className={styles.fullTextField}
                placeholder="Deposit"
                value={edit.homeData.deposit}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  if (
                    inputValue === "" ||
                    (inputValue > 0 && inputValue.length <= 6)
                  ) {
                    setEdit((prevData) => ({
                      ...prevData,
                      homeData: {
                        ...prevData.homeData,
                        deposit: inputValue,
                      },
                    }));
                  }
                }}
              />
            )}
            {edit.field.includes("deposit") && errors && errors.deposit && (
              <span className={styles.error}>*{errors.deposit}</span>
            )}
            {edit.field.length > 0 && edit.field.includes("property") && (
              <div className={styles.form}>
                <div className={styles.selection}>
                  <p>Bedrooms</p>
                  <div className={styles.selector}>
                    <AiOutlineMinusCircle
                      onClick={() => {
                        edit.homeData.bedRooms > 1 &&
                          handleDeacrement("bedRooms");
                      }}
                    />
                    <h3>{edit.homeData.bedRooms}</h3>
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
                        edit.homeData.bathRooms > 1 &&
                          handleDeacrement("bathRooms");
                      }}
                    />
                    <h3>{edit.homeData.bathRooms}</h3>{" "}
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
                        edit.homeData.livingrooms > 1 &&
                          handleDeacrement("livingrooms");
                      }}
                    />
                    <h3>{edit.homeData.livingrooms}</h3>
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
                        value={edit.homeData.haveGarden}
                        checked={edit.homeData.haveGarden}
                        onChange={() =>
                          setEdit((prevData) => ({
                            ...prevData,
                            homeData: {
                              ...prevData.homeData,
                              haveGarden: true,
                            },
                          }))
                        }
                      />
                      <label>Yes</label>
                    </div>
                    <div className={styles.selectionRadion}>
                      <input
                        type="radio"
                        value={edit.homeData.haveGarden}
                        checked={!edit.homeData.haveGarden}
                        onChange={() =>
                          setEdit((prevData) => ({
                            ...prevData,
                            homeData: {
                              ...prevData.homeData,
                              haveGarden: false,
                            },
                          }))
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
                    value={edit.homeData.size}
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      if (
                        inputValue === "" ||
                        (inputValue > 0 && inputValue.length <= 7)
                      ) {
                        setEdit((prevData) => ({
                          ...prevData,
                          homeData: {
                            ...prevData.homeData,
                            size: inputValue,
                          },
                        }));
                      }
                    }}
                  />
                </div>
                <div className={styles.selectionInput}>
                  <label style={{margin:"8px 0"}}>
                    {" "}
                    Anything else you would like to share about your home?
                  </label>
                  <textarea
                    rows={4}
                    type="text"
                    value={edit.homeData.about}
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      setEdit((prevData) => ({
                        ...prevData,
                        homeData: {
                          ...prevData.homeData,
                          about: inputValue,
                        },
                      }));
                    }}
                  />
                </div>
                {/* {errors && errors.size && (
                  <span className={styles.error}>{errors.size}</span>
                )} */}
              </div>
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
                  edit.userData.location === "Location" && "colorChangeSelect"
                }`}
                style={{
                  color: `${
                    edit.userData.location !== "Location" ? "black" : "#8b8b8b"
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
            {edit.field.length > 0 && edit.field.includes("rules") && (
              <div className={styles.form}>
                <div className={styles.selection}>
                  <p>Pets allowed?</p>
                  <div className={styles.selector}>
                    <div className={styles.selectionRadion}>
                      <input
                        type="radio"
                        value={edit.homeData.isPetsAllowed}
                        checked={edit.homeData.isPetsAllowed}
                        onChange={() =>
                          setEdit((prevData) => ({
                            ...prevData,
                            homeData: {
                              ...prevData.homeData,
                              isPetsAllowed: true,
                            },
                          }))
                        }
                      />
                      <label>Yes</label>
                    </div>
                    <div className={styles.selectionRadion}>
                      <input
                        type="radio"
                        value={edit.homeData.isPetsAllowed}
                        checked={!edit.homeData.isPetsAllowed}
                        onChange={() =>
                          setEdit((prevData) => ({
                            ...prevData,
                            homeData: {
                              ...prevData.homeData,
                              isPetsAllowed: false,
                            },
                          }))
                        }
                      />
                      <label>No</label>
                    </div>
                  </div>
                </div>

                <div className={styles.selection}>
                  <p>Smoking allowed?</p>
                  <div className={styles.selector}>
                    <div className={styles.selectionRadion}>
                      <input
                        type="radio"
                        value={edit.homeData.isSmokingAllowed}
                        checked={edit.homeData.isSmokingAllowed}
                        onChange={() =>
                          setEdit((prevData) => ({
                            ...prevData,
                            homeData: {
                              ...prevData.homeData,
                              isSmokingAllowed: true,
                            },
                          }))
                        }
                      />
                      <label>Yes</label>
                    </div>
                    <div className={styles.selectionRadion}>
                      <input
                        type="radio"
                        value={edit.homeData.isSmokingAllowed}
                        checked={!edit.homeData.isSmokingAllowed}
                        onChange={() =>
                          setEdit((prevData) => ({
                            ...prevData,
                            homeData: {
                              ...prevData.homeData,
                              isSmokingAllowed: false,
                            },
                          }))
                        }
                      />
                      <label>No</label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {edit.field.length > 0 && edit.field.includes("pricing") && (
              <div className={styles.form}>
                <div className={styles.fullWidthInput}>
                  <label className={styles.label}>Rent per month</label>
                  <input
                    placeholder="0"
                    type="number"
                    className={styles.fullTextField}
                    value={edit.homeData.rent}
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      if (
                        inputValue === "" ||
                        (inputValue > 0 && inputValue.length <= 6)
                      ) {
                        setEdit((prevData) => ({
                          ...prevData,
                          homeData: {
                            ...prevData.homeData,
                            rent: inputValue,
                          },
                        }));
                      }
                    }}
                  />
                </div>
                {edit.field.includes("pricing") &&
                  errors &&
                  errors.rentalBudget && (
                    <span className={styles.error}>*{errors.rentalBudget}</span>
                  )}
                <div className={styles.fullWidthInput}>
                  <label className={styles.label}>Deposit</label>
                  <input
                    placeholder="0"
                    type="number"
                    className={styles.fullTextField}
                    value={edit.homeData.deposit}
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      if (
                        inputValue === "" ||
                        (inputValue > 0 && inputValue.length <= 6)
                      ) {
                        setEdit((prevData) => ({
                          ...prevData,
                          homeData: {
                            ...prevData.homeData,
                            deposit: inputValue,
                          },
                        }));
                      }
                    }}
                  />
                </div>
                {edit.field.includes("pricing") && errors && errors.deposit && (
                  <span className={styles.error}>*{errors.deposit}</span>
                )}
                {/* {errors && errors.rent && (
                      <span className={styles.error}>{errors.rent}</span>
                    )} */}
              </div>
            )}
            {edit.field.length > 0 && edit.field.includes("things") && (
              <div>
                {" "}
                <div className={styles.selection}>
                  <p>Water Included?</p>
                  <div className={styles.selector}>
                    <div className={styles.selectionRadion}>
                      <input
                        type="radio"
                        checked={edit.homeData.isWaterIncluded}
                        value={edit.homeData.isWaterIncluded}
                        onChange={() =>
                          setEdit((prevData) => ({
                            ...prevData,
                            homeData: {
                              ...prevData.homeData,
                              isWaterIncluded: true,
                            },
                          }))
                        }
                      />
                      <label>Yes</label>
                    </div>
                    <div className={styles.selectionRadion}>
                      <input
                        type="radio"
                        checked={!edit.homeData.isWaterIncluded}
                        value={edit.homeData.isWaterIncluded}
                        onChange={() =>
                          setEdit((prevData) => ({
                            ...prevData,
                            homeData: {
                              ...prevData.homeData,
                              isWaterIncluded: false,
                            },
                          }))
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
                        checked={edit.homeData.isElectricityIncluded}
                        value={edit.homeData.isElectricityIncluded}
                        onChange={() =>
                          setEdit((prevData) => ({
                            ...prevData,
                            homeData: {
                              ...prevData.homeData,
                              isElectricityIncluded: true,
                            },
                          }))
                        }
                      />
                      <label>Yes</label>
                    </div>
                    <div className={styles.selectionRadion}>
                      <input
                        type="radio"
                        checked={!edit.homeData.isElectricityIncluded}
                        value={edit.homeData.isElectricityIncluded}
                        onChange={() =>
                          setEdit((prevData) => ({
                            ...prevData,
                            homeData: {
                              ...prevData.homeData,
                              isElectricityIncluded: false,
                            },
                          }))
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
                        checked={edit.homeData.isInternetIncluded}
                        value={edit.homeData.isInternetIncluded}
                        onChange={() =>
                          setEdit((prevData) => ({
                            ...prevData,
                            homeData: {
                              ...prevData.homeData,
                              isInternetIncluded: true,
                            },
                          }))
                        }
                      />
                      <label>Yes</label>
                    </div>
                    <div className={styles.selectionRadion}>
                      <input
                        type="radio"
                        checked={!edit.homeData.isInternetIncluded}
                        value={edit.homeData.isInternetIncluded}
                        onChange={() =>
                          setEdit((prevData) => ({
                            ...prevData,
                            homeData: {
                              ...prevData.homeData,
                              isInternetIncluded: false,
                            },
                          }))
                        }
                      />
                      <label>No</label>
                    </div>
                    <div></div>
                  </div>
                </div>
              </div>
            )}
            {edit.field.length > 0 && edit.field.includes("Availabilty") && (
              <div className={styles.form}>
                <div className={styles.selection}>
                  <p>No of available rooms</p>
                  <div className={styles.selector}>
                    <AiOutlineMinusCircle
                      onClick={() => {
                        edit.homeData.availableRooms > 1 &&
                          handleDeacrement("availableRooms");
                      }}
                    />
                    <h3>{edit.homeData.availableRooms}</h3>{" "}
                    <AiOutlinePlusCircle
                      onClick={() => handleIncreament("availableRooms")}
                    />
                  </div>
                </div>

                <div className={styles.selectionWithInput}>
                  <p>Available from</p>
                  <div className={styles.selectionInput}>
                    {/* <DatePicker
                      disabledDate={disabledDate}
                      className="homeDate"
                      format="YYYY-MM-DD"
                      style={{ zIndex: 1050 }}
                      inputReadOnly
                      value={edit.homeData.tempDate}
                      onChange={handleDateChange}
                      placeholder="Select date"
                    /> */}
                    <input
                      type="date"
                      value={moment(edit.homeData.availableFrom).format(
                        "YYYY-MM-DD"
                      )}
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
                      min={moment().format("YYYY-MM-DD")}
                      onChange={(e) =>
                        setEdit((prevData) => ({
                          ...prevData,
                          homeData: {
                            ...prevData.homeData,
                            availableFrom: e.target.value,
                          },
                        }))
                      }
                    />
                  </div>
                </div>
                {/* {errors && errors.availableFrom && (
                  <span className={styles.error}>{errors.availableFrom}</span>
                )} */}

                <div className={styles.selectionWithInput}>
                  <p>Minimum lease period</p>
                  <div className={styles.selectionInput}>
                    <input
                      type="number"
                      placeholder="0"
                      value={edit.homeData.minLeasePeriod}
                      onChange={(e) => {
                        const inputValue = e.target.value;
                        if (
                          inputValue === "" ||
                          (inputValue > 0 && inputValue.length <= 2)
                        ) {
                          setEdit((prevData) => ({
                            ...prevData,
                            homeData: {
                              ...prevData.homeData,
                              minLeasePeriod: e.target.value,
                            },
                          }));
                        }
                      }}
                    />
                  </div>
                </div>
                {edit.field.includes("Availabilty") &&
                  errors &&
                  errors.minLeasePeriod && (
                    <span className={styles.error}>
                      *{errors.minLeasePeriod}
                    </span>
                  )}
              </div>
            )}
            <button
              onClick={() => {
                edit.field.includes("firstName") ||
                edit.field.includes("location")
                  ? handleCreateProfile()
                  : handleCreateHome();
              }}
            >
              {edit.updateLoader ? "...Updating" : "Update"}
            </button>
          </div>
        }
      />
      <CommonModal
        className="userProfile"
        size="lg"
        hide={true}
        show={openMoveIn}
        setShow={() => {
          setOpenMoveIn(false);
        }}
        bodyContent={
          <div className={styles.requestContainer}>
            <Lottie options={defaultOptions} height={250} width={250} />
            <h2>Request sent!</h2>
            <p>
              Your request has been sent to the owner. We will
              <br /> notify you once the request is accepted
            </p>
            <button
              onClick={
                () => {
                  setOpenMoveIn(false);
                }
                // updateMoveInStatus(
                //   activeUser.userId,
                //   "GOT-REQUEST",
                //   "REQUESTED"
                // )
              }
            >
              Continue
            </button>
          </div>
        }
      />

      {!data.home && <AppLoader />}
      {data.home && (
        <>
          <div className={styles.content1}>
            <ProfileCard
              edit={edit}
              setEdit={setEdit}
              property={data.home}
              data={data}
              getHouseMates={props.getHouseMates}
              favoritesList={favoritesList}
              addHomeFavorite={addHomeFavorite}
              deleteHomeFavorite={deleteHomeFavorite}
            />
            <hr />
            <div className={styles.about}>
              <h4 className="mb-4">
                About this property{" "}
                {!id && (
                  <FaRegEdit
                    color="#B3B3B3"
                    size="0.8rem"
                    cursor="pointer"
                    style={{ marginLeft: "0.8rem" }}
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
              <p className={styles.aboutP}>{data?.home?.about}</p>
              <div className="d-flex justify-content-between">
                <div className={styles.table}>
                  <p>No. of bedrooms:</p>
                  <p>{data?.home.bedRooms}</p>

                  <p>No. of bathrooms:</p>
                  <p>{data?.home.bathRooms}</p>

                  <p>Size:</p>
                  <p>{data?.home.size} m*2</p>
                </div>
                <div className={styles.table}>
                  <p>No. of living room:</p>
                  <p>{data?.home.livingrooms}</p>

                  <p>Garden:</p>
                  <p>{data?.home.haveGarden ? "Yes" : "No"}</p>
                </div>
              </div>
            </div>

            <hr />

            <div className={styles.about}>
              <h4 className="mb-4">
                House rules{" "}
                {!id && (
                  <FaRegEdit
                    color="#B3B3B3"
                    size="0.8rem"
                    cursor="pointer"
                    style={{ marginLeft: "0.8rem" }}
                    onClick={() =>
                      setEdit({
                        ...edit,
                        field: ["rules"],
                        open: true,
                      })
                    }
                  />
                )}
              </h4>
              <div className="d-flex justify-content-between">
                <div className={styles.table}>
                  <p>Pets Allowed:</p>
                  <p>{data?.home.isPetsAllowed ? "Yes" : "No"}</p>
                </div>
                <div className={styles.table}>
                  <p>Smoking Allowed:</p>
                  <p>{data?.home.isSmokingAllowed ? "Yes" : "No"}</p>
                </div>
              </div>
            </div>
            <hr />
            <div className={styles.about}>
              <h4 className="mb-4">
                Pricing{" "}
                {!id && (
                  <FaRegEdit
                    color="#B3B3B3"
                    size="0.8rem"
                    cursor="pointer"
                    style={{ marginLeft: "0.8rem" }}
                    onClick={() =>
                      setEdit({
                        ...edit,
                        field: ["pricing"],
                        open: true,
                      })
                    }
                  />
                )}
              </h4>

              <div className={styles.table}>
                {
                  <>
                    <p>Rent per month:</p>
                    <p style={{ color: "#606060", fontSize: "0.85rem" }}>
                      {data.home.currencyType} {data?.home.rent}/month
                    </p>
                  </>
                }
                <p>Deposit required:</p>
                <p style={{ color: "#606060", fontSize: "0.85rem" }}>
                  {data.home.currencyType} {data?.home.deposit}/month
                </p>
              </div>
              {/* {isTabletOrMobile && <hr />} */}
              <h5>
                Are following things included?{" "}
                {!id && (
                  <FaRegEdit
                    color="#B3B3B3"
                    size="0.8rem"
                    cursor="pointer"
                    style={{ marginLeft: "0.8rem" }}
                    onClick={() =>
                      setEdit({
                        ...edit,
                        field: ["things"],
                        open: true,
                      })
                    }
                  />
                )}
              </h5>

              <div className={styles.table}>
                <p>Water included:</p>
                <p>{data?.home.isWaterIncluded ? "Yes" : "No"}</p>
                <p>Electricity included:</p>
                <p>{data?.home.isElectricityIncluded ? "Yes" : "No"}</p>
                <p>Internet included:</p>
                <p>{data?.home.isInternetIncluded ? "Yes" : "No"}</p>
              </div>
            </div>

            {!isTabletOrMobile && <hr />}

            <div className={styles.about}>
              <h4 className="mb-4">
                Availabilty{" "}
                {!id && (
                  <FaRegEdit
                    color="#B3B3B3"
                    size="0.8rem"
                    cursor="pointer"
                    style={{ marginLeft: "0.8rem" }}
                    onClick={() =>
                      setEdit({
                        ...edit,
                        field: ["Availabilty"],
                        open: true,
                      })
                    }
                  />
                )}
              </h4>

              <div className={styles.table}>
                <p>Available rooms:</p>
                <p>{data?.home.availableRooms}</p>
                <p>Available from:</p>
                <p>
                  {DateSplit(
                    moment(data?.home?.availableFrom).format("DD-MM-YYYY")
                  )}
                </p>

                <p>Min lease period:</p>
                <p>{data?.home.minLeasePeriod}</p>
              </div>
            </div>
          </div>
          {!isTabletOrMobile && (
            <div className={styles.content2}>
              {data.user && (
                <>
                  <img
                    src={data.user ? data.user?.images[0] : NewImg}
                    alt="homeshare"
                  />

                  <div className="d-flex mt-1" style={{ width: "95%" }}>
                    <div style={{ width: "100%" }}>
                      <div className="d-flex justify-content-between mt-2">
                        <p
                          className="fs-8 mb-0 fw-bolder mt-2"
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            id
                              ? router.push(`/mates?_id=${data.user._id}`)
                              : router.push("/profile");
                          }}
                        >
                          {" "}
                          About the owner
                        </p>
                        {id && (
                          <Button
                            style={{
                              width: "47%",
                              background: "#f8cd46",
                              border: "none",
                            }}
                            onClick={() =>
                              router.push(
                                `/messages?userId=${
                                  data.home.userId
                                }&firstName=${data?.user?.firstName}&lastName=${
                                  data?.user?.lastName
                                }&img=${
                                  data.user &&
                                  data.user.images[0] &&
                                  data.user.images[0]
                                }`
                              )
                            }
                            // onClick={() =>
                            //   router.push(
                            //     `/messages?userId=${data.home.userId}`
                            //   )
                            // }
                          >
                            Send message
                          </Button>
                        )}
                      </div>

                      <div className="d-flex justify-content-between mt-2">
                        <div className={styles.owner}>
                          <p className="fs-10 mb-0 d-flex align-items-center">
                            {data.user &&
                              data.user.firstName &&
                              toCamelCase(data.user?.firstName)}{" "}
                            {data.user?.lastName}
                            <MdVerifiedUser
                              color="#3BD600"
                              style={{ marginLeft: "0.3rem" }}
                            />
                          </p>
                          <p className="fs-10 mb-0">
                            {" "}
                            {checkAge({
                              userProfile: { dob: data.user.dob },
                            })}{" "}
                            yrs old
                          </p>
                        </div>

                        {id && data.moveIn && data.moveIn === "NO_DATA" && (
                          <Button
                            onClick={() => {
                              saveCustomDocumentId();
                              setLoading(true);
                            }}
                            style={{
                              width: "47%",
                              background: "#f8cd46",
                              border: "none",
                            }}
                          >
                            {loading ? "Please wait..." : "Pick property"}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
          {isTabletOrMobile && (
            <div className={styles.mobileOwner}>
              <h4 className="mb-4">About the owner</h4>
              <div className={styles.ownerFlex}>
                <div className={styles.leftContent}>
                  <img
                    src={data.user ? data.user?.images[0] : NewImg}
                    alt="homeshare"
                  />
                </div>
                <div className={styles.rightContent}>
                  <h3 className="fs-10 mb-0 d-flex align-items-center">
                    {data.user?.firstName &&
                      toCamelCase(data.user?.firstName) +
                        " " +
                        data.user?.lastName}{" "}
                    <MdVerifiedUser
                      color="#3BD600"
                      style={{ marginLeft: "0.3rem" }}
                    />
                  </h3>
                  <p className="fs-10 mb-0">
                    {" "}
                    {checkAge({
                      userProfile: { dob: data.user.dob },
                    })}{" "}
                    yrs old
                  </p>
                  <p className="fs-10 mb-0">
                    {data.home.currencyType + " " + data.home.rent}{" "}
                  </p>
                  <p className="fs-10 mb-0">
                    {" "}
                    <MdLocationOn
                      color="#606060"
                      className={styles.locationIcon}
                      size={"1.2rem"}
                    />
                    {data?.user?.location}
                  </p>
                </div>
              </div>
              {id && (
                <div>
                  <Button
                    style={{
                      width: "100%",
                      margin: "1rem 0",
                      background: "#f8cd46",
                      border: "none",
                    }}
                    onClick={() =>
                      router.push(
                        `/messages?userId=${data.home.userId}&firstName=${
                          data?.user?.firstName
                        }&lastName=${data?.user?.lastName}&img=${
                          data.user &&
                          data.user.images[0] &&
                          data.user.images[0]
                        }`
                      )
                    }
                  >
                    Send message
                  </Button>
                  {data.moveIn && data.moveIn == "NO_DATA" && (
                    <Button
                      onClick={() => {
                        saveCustomDocumentId();
                        setLoading(true);
                      }}
                      style={{
                        width: "100%",
                        background: "#f8cd46",
                        border: "none",
                      }}
                    >
                      {loading ? "Please wait..." : "Pick property"}
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    user: state.auth.user,
    userFavorites: state.auth.userFavorites,
    cities: state.content.cities,
  };
};

export default connect(mapStateToProps, {
  getUser,
  getFavorites,
  getHouseMates,
  getMoveIn,
  getFavorites,
  getCities,
})(Property);
