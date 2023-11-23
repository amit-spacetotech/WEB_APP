import React from "react";
import styles from "./filter.module.css";
// import Slider from "./slider";
import { Slider, Checkbox } from "antd";
import { RxCross2 } from "react-icons/rx";
function HouseMateFilter(props) {
  const genderArr = ["Male", "Female", "Others"];
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
  const handleInterestChange = (interest) => {
    if (props.houseMates.interest.includes(interest)) {
      props.setHouseMates({
        ...props.houseMates,
        interest: props.houseMates.interest.filter((item) => item !== interest),
      });
      props.handleHouseFilter({
        interest: props.houseMates.interest.filter((item) => item !== interest),
      });
    } else {
      props.setHouseMates({
        ...props.houseMates,
        interest: [...props.houseMates.interest, interest],
      });
      props.handleHouseFilter({
        interest: [...props.houseMates.interest, interest],
      });
    }

    //  props.handleHouseFilter({})
  };
  const handleGenderChange = (interest) => {
    if (props.houseMates.gender.includes(interest)) {
      props.setHouseMates({
        ...props.houseMates,
        gender: props.houseMates.gender.filter((item) => item !== interest),
      });
      props.handleHouseFilter({
        gender: props.houseMates.gender.filter((item) => item !== interest),
      });
    } else {
      props.setHouseMates({
        ...props.houseMates,
        gender: [...props.houseMates.gender, interest],
      });
      props.handleHouseFilter({
        gender: [...props.houseMates.gender, interest],
      });
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <RxCross2
          style={{
            top: "15px",
            position: "absolute",
            right: "15px",
            fontWeight: "bolder",
            fontSize: "20px",
            cursor: "pointer",
          }}
          onClick={() => {
            props.setShow();
          }}
        />

        <h2>Filters</h2>
        {/* <hr style={{ margin: 0 }} /> */}
      </div>
      <div className={styles.section}>
        <h4>Budget</h4>
        <div className={styles.flexComp}>
          <p>0 Zar</p>
          <p>20000+ Zar</p>
        </div>
        <Slider
          range
          min={0}
          max={20000}
          value={[props.houseMates.minRent, props.houseMates.maxRent]}
          className="slider"
          onChange={(values) => {
            props.setHouseMates({
              ...props.houseMates,
              minRent: values[0],
              maxRent: values[1],
            });
          }}
          onAfterChange={(values) => {
            if (values[0] > values[1]) {
              // Swap the values if the left slider is greater than the right slider
              props.setHouseMates({
                ...props.houseMates,
                minRent: values[1],
                maxRent: values[0],
              });
            }
            props.handleHouseFilter({
              rent: { minRent: values[0], maxRent: values[1] },
            });
          }}
        />
      </div>
      <hr />
      <div className={styles.section}>
        <h4>Gender</h4>
        {genderArr.map((val) => {
          return (
            <div className={styles.flexComp} key={val}>
              <p>{val}</p>
              <Checkbox
                className="custom-checkbox"
                style={{ width: "15px", marginRight: "5px" }}
                checked={props.houseMates.gender.includes(val)}
                value={val}
                onChange={(e) => handleGenderChange(val)}
              />
            </div>
          );
        })}
      </div>
      <hr />
      <div className={styles.section}>
        <h4>Pets allowed</h4>

        <div className={styles.flexComp}>
          <p>Yes</p>
          <input
            type="radio"
            checked={props.houseMates.havePets}
            onChange={() => {
              props.setHouseMates({ ...props.houseMates, havePets: true });
              props.handleHouseFilter({ havePets: "true" });
            }}
          />
        </div>
        <div className={styles.flexComp}>
          <p>No</p>
          <input
            type="radio"
            checked={!props.houseMates.havePets}
            onChange={() => {
              props.setHouseMates({ ...props.houseMates, havePets: false });
              props.handleHouseFilter({ havePets: "false" });
            }}
          />
        </div>
      </div>
      <hr />
      <div className={styles.section}>
        <h4>Interests</h4>
        {interestArr.map((val) => {
          return (
            <div className={styles.flexComp} key={val}>
              <p>{val}</p>
              <Checkbox
                className="custom-checkbox"
                style={{ width: "15px", marginRight: "5px" }}
                checked={props.houseMates.interest.includes(val)}
                value={val}
                onChange={(e) => handleInterestChange(val)}
              />
            </div>
          );
        })}
      </div>
      <hr />
      <div className={styles.section}>
        <h4>Age range</h4>
        <div className={styles.flexComp}>
          <p>18 years</p>
          <p>30+ years</p>
        </div>
        <Slider
          range
          min={0}
          max={30}
          value={[props.houseMates.minAge, props.houseMates.maxAge]}
          className="slider"
          onChange={(values) => {
            props.setHouseMates({
              ...props.houseMates,
              minAge: values[0],
              maxAge: values[1],
            });
            props.handleHouseFilter({
              age: { minAge: values[0], maxAge: values[1] },
            });
          }}
        />
      </div>
      <div className={styles.buttonSection}>
        <button
          onClick={() => {
            props.getHouseMateData();
            props.setShow();
          }}
        >
          Show {"("}
          {props.count}
          {")"} results{" "}
        </button>
      </div>
    </div>
  );
}

export default HouseMateFilter;
