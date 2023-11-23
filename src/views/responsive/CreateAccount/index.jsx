import React, { useState } from "react";
import styles from "./index.module.css";
import dynamic from "next/dynamic";
import handleFileUpload from "@/utils/uploadImage";
import axios from "axios";
import { connect } from "react-redux";
import moment from "moment";
import { useRouter } from "next/router";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../../config/config";
import { DatePicker } from "antd";
import { getCities } from "@/redux/actions/contentAction";
const Start = dynamic(() => import("./Start/Start"), { ssr: false });
const Page1 = dynamic(() => import("./Page1/Page1"), { ssr: false });
const Page2 = dynamic(() => import("./Page2/Page2"), { ssr: false });
const Page3 = dynamic(() => import("./Page3/Page3"), { ssr: false });
const Page4 = dynamic(() => import("./Page4/Page4"), { ssr: false });
const Page5 = dynamic(() => import("./Page5/Page5"), { ssr: false });
const Complete = dynamic(() => import("./Complete/Complete"), { ssr: false });

const Index = (props) => {
  const [page, setPage] = useState(0);
  const router = useRouter();
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
    tempDate: false,
    isVerified: true,
  });
  const [cities, setCities] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [errors, setErrors] = React.useState({});
  function toCamelCase(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  const handleChangeLocation = (value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      location: value,
    }));
  };
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
      setPage(2);
    }
  };

  const check = async () => {
    await setDoc(doc(db, `userList/${props.auth.user._id}`), {
      home: true,
    });
  };
  React.useEffect(() => {
    if (props.auth.user && props.auth.user.userProfile) {
      router.push("/");
    }
  }, [props.auth]);

  const validateLifeStyleForm = () => {
    const newErrors = {};
    const basicForm = {
      rentalBudget: "",
      currency: "",
      peopleCapacity: "",
      religion: "",
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
      setPage(4);
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
  React.useEffect(() => {
    if (!props.cities) {
      props.getCities();
    }
  }, [props.cities]);
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

  function handleFileSelect(event, index) {
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/gif"];
    const selectedFile = event.target.files[0];

    if (allowedTypes.includes(selectedFile.type)) {
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
        check();
        setPage(6);
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

  const interestArr = [
    "Art",
    "Cooking",
    "Dancing",
    "Gym",
    "Music",
    "Language",
    "Reading",
    "Hiking",
    "Sports",
    "History",
    "Travel",
  ];
  const validateInterestForm = () => {
    const newErrors = {};
    const basicForm = {
      interest: "Please select atleast one interest",
      about: "Description",
    };
    Object.keys(basicForm).forEach((key) => {
      if (key === "about" ? !formData[key] : formData[key].length < 1) {
        newErrors[key] = `${
          key === "about"
            ? toCamelCase(basicForm["about"]) + "is required"
            : basicForm["interest"]
        } `;
      }
    });

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setPage(page + 1);
    }
  };

  return (
    <div className={styles.createAccount}>
      {page !== 0 && page !== 6 && (
        <div className={styles.numberDiv}>
          <span>-</span>

          <div className={styles.number} id={page === 1 && styles.active}>
            1
          </div>
          <span id={styles.fullWidth}>- - - -</span>
          <span id={styles.halfWidth}>- -</span>

          <div className={styles.number} id={page === 2 && styles.active}>
            2
          </div>
          <span id={styles.fullWidth}>- - - -</span>
          <span id={styles.halfWidth}>- -</span>

          <div className={styles.number} id={page === 3 && styles.active}>
            3
          </div>
          <span id={styles.fullWidth}>- - - -</span>
          <span id={styles.halfWidth}>- -</span>

          <div className={styles.number} id={page === 4 && styles.active}>
            4
          </div>
          <span id={styles.fullWidth}>- - - -</span>
          <span id={styles.halfWidth}> - - </span>

          <div className={styles.number} id={page === 5 && styles.active}>
            5
          </div>
          <span>-</span>
        </div>
      )}

      <div>
        {page === 0 && <Start setPage={setPage} />}
        {page === 1 && (
          <Page1
            setFormData={setFormData}
            errors={errors}
            cities={cities}
            handleChangeLocation={handleChangeLocation}
            formData={formData}
            validateBasicForm={validateBasicForm}
          />
        )}
        {page === 2 && (
          <Page2
            setPage={setPage}
            page={page}
            errors={errors}
            setErrors={setErrors}
            selectedFile={selectedFile}
            setFormData={setFormData}
            formData={formData}
            handleFileSelect={handleFileSelect}
          />
        )}
        {page === 3 && (
          <Page3
            setPage={setPage}
            page={page}
            validateLifeStyleForm={validateLifeStyleForm}
            errors={errors}
            selectedFile={selectedFile}
            setFormData={setFormData}
            formData={formData}
            handleFileSelect={handleFileSelect}
          />
        )}
        {page === 4 && (
          <Page4
            setPage={setPage}
            setFormData={setFormData}
            page={page}
            errors={errors}
            formData={formData}
            handleFileSelect={handleFileSelect}
            validateInterestForm={validateInterestForm}
            handleInterestChange={handleInterestChange}
            interestArr={interestArr}
          />
        )}
        {page === 5 && (
          <Page5
            setPage={setPage}
            page={page}
            setErrors={setErrors}
            errors={errors}
            loading={loading}
            handleCreateProfile={handleCreateProfile}
          />
        )}
        {page === 6 && <Complete />}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    cities: state.content.cities,
  };
};

export default connect(mapStateToProps, { getCities })(Index);
