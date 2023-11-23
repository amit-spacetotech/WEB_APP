import React, { useState } from "react";
import styles from "./Page.module.css";
import { IoIosArrowBack } from "react-icons/io";

const Page4 = ({
  page,
  setPage,
  handleInterestChange,
  validateInterestForm,
  interestArr,
  formData,
  errors,
  setFormData,
}) => {
  return (
    <div className={styles.page}>
      <div className={styles.formDiv}>
        <h1>Your interests</h1>
        <p>What are your interests?</p>
        <div className={styles.innerDiv}>
          <div>
            {interestArr.map((val, index) => {
              return (
                <button
                  id={`${formData.interest.includes(val) && styles.active}`}
                  key={index}
                  onClick={() => handleInterestChange(val)}
                >
                  {val}
                </button>
              );
            })}
          </div>
        </div>
        {errors && errors.interest && (
          <span className={styles.error}>*{errors.interest}</span>
        )}
        <div className={styles.textareaDiv}>
          <p>Anything else you would like to add?</p>
          <textarea
            rows={12}
            value={formData.about}
            onChange={(e) => {
              if (e.target.value.length <= 200) {
                setFormData({ ...formData, about: e.target.value });
              }
            }}
            placeholder="Do you have any additional information you would like to add? Write a brief summary here."
            className={styles.textArea}
          />
          {errors && errors.about && (
            <span className={styles.error}>*{errors.about}</span>
          )}
        </div>
        <div className={styles.buttonDiv}>
          <div onClick={() => setPage(page - 1)}>
            <IoIosArrowBack /> Back
          </div>
          <button onClick={() => validateInterestForm()}>Next</button>
        </div>
      </div>
    </div>
  );
};

export default Page4;
