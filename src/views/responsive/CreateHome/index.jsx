import React, { useEffect, useState } from "react";
import styles from "./index.module.css";
import dynamic from "next/dynamic";
import handleFileUpload from "@/utils/uploadImage";
import axios from "axios";
import { useMediaQuery } from "react-responsive";
import { useRouter } from "next/router";

const Start = dynamic(() => import("./Start/Start"), { ssr: false });
const Page1 = dynamic(() => import("./Page1/Page1"), { ssr: false });
const Page2 = dynamic(() => import("./Page2/Page2"), { ssr: false });
const Page3 = dynamic(() => import("./Page3/Page3"), { ssr: false });
const Page4 = dynamic(() => import("./Page4/Page4"), { ssr: false });
const Page5 = dynamic(() => import("./Page5/Page5"), { ssr: false });
const Page6 = dynamic(() => import("./Page6/Page6"), { ssr: false });
const Complete = dynamic(() => import("./Complete/Complete"), { ssr: false });

const Index = (props) => {
  const [page, setPage] = React.useState(0);

  const [formData, setFormData] = React.useState({
    bedRooms: 1,
    bathRooms: 1,
    livingrooms: 1,
    size: "",
    deposit: "",
    tempDate: "",
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
  });

  const [loading, setLoading] = React.useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [errors, setErrors] = React.useState({});
  const router = useRouter();
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 600px)" });

  const validateBasicForm = () => {
    const newErrors = {};
    const basicForm = {
      size: 0,
    };
    Object.keys(basicForm).forEach((key) => {
      if (Number(formData[key]) === 0 || !formData[key]) {
        newErrors[key] = "Please enter property size greater than 0";
      }
    });

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setPage(2);
    }
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
    if (Number(formData.deposit) < 1) {
      newErrors["deposit"] = "Please enter a value > 0";
    }
    if (Number(formData.rent) < 1) {
      newErrors["rent"] = "Please enter a value > 0";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setPage(4);
    }
  };

  const validateAvailabilityForm = () => {
    const newErrors = {};
    const basicForm = {
      availableFrom: "Availaible from",
      minLeasePeriod: "Minimum lease Period",
    };
    Object.keys(basicForm).forEach((key) => {
      if (!formData[key]) {
        newErrors[key] = `${basicForm[key]} is required`;
      }
    });

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setPage(5);
    }
  };

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
        setPage(7);
        props.setStepNo(7);
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

  const handleIncreament = (fieldName) => {
    setFormData({ ...formData, [fieldName]: formData[fieldName] + 1 });
  };

  const handleDeacrement = (fieldName) => {
    if (formData[fieldName] > 0) {
      setFormData({ ...formData, [fieldName]: formData[fieldName] - 1 });
    }
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
  return (
    <div className={styles.createAccount}>
      {page !== 0 && page !== 7 && (
        <div className={styles.numberDiv}>
          <span>-</span>

          <div className={styles.number} id={page === 1 && styles.active}>
            1
          </div>
          <span id={styles.fullWidth}>- - -</span>
          <span id={styles.halfWidth}>- -</span>

          <div className={styles.number} id={page === 2 && styles.active}>
            2
          </div>
          <span id={styles.fullWidth}>- - -</span>
          <span id={styles.halfWidth}>- -</span>

          <div className={styles.number} id={page === 3 && styles.active}>
            3
          </div>
          <span id={styles.fullWidth}>- - -</span>
          <span id={styles.halfWidth}>- -</span>

          <div className={styles.number} id={page === 4 && styles.active}>
            4
          </div>
          <span id={styles.fullWidth}>- - -</span>
          <span id={styles.halfWidth}>- -</span>

          <div className={styles.number} id={page === 5 && styles.active}>
            5
          </div>
          <span id={styles.fullWidth}>- - -</span>
          <span id={styles.halfWidth}>- -</span>
          <div className={styles.number} id={page === 6 && styles.active}>
            6
          </div>
          <span>-</span>
        </div>
      )}

      <div>
        {page === 0 && (
          <Start
            setPage={(val) => {
              setPage(val);
              props.setStepNo(val);
            }}
          />
        )}
        {page === 1 && (
          <Page1
            setFormData={setFormData}
            errors={errors}
            handleDeacrement={handleDeacrement}
            handleIncreament={handleIncreament}
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
            validatePricingForm={validatePricingForm}
            page={page}
            errors={errors}
            selectedFile={selectedFile}
            setFormData={setFormData}
            formData={formData}
            handleFileSelect={handleFileSelect}
          />
        )}
        {page === 4 && (
          <Page4
            setFormData={setFormData}
            setPage={setPage}
            errors={errors}
            handleIncreament={handleIncreament}
            formData={formData}
            validateAvailabilityForm={validateAvailabilityForm}
            handleFileSelect={handleFileSelect}
            handleDeacrement={handleDeacrement}
          />
        )}
        {page === 5 && (
          <Page5
            setPage={setPage}
            selectedFile={selectedFile}
            handleFileSelect={handleFileSelect}
            errors={errors}
            formData={formData}
            setFormData={setFormData}
            setErrors={setErrors}
            page={page}
            loading={loading}
            handleCreateProfile={handleCreateProfile}
          />
        )}
        {page === 6 && (
          <Page6
            setPage={setPage}
            selectedFile={selectedFile}
            handleFileSelect={handleFileSelect}
            errors={errors}
            setFormData={setFormData}
            formData={formData}
            setErrors={setErrors}
            page={page}
            loading={loading}
            handleCreateProfile={handleCreateProfile}
          />
        )}
        {page === 7 && <Complete />}
      </div>
    </div>
  );
};

export default Index;
