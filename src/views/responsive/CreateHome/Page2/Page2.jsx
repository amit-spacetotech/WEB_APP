import React from "react";
import { IoIosArrowBack } from "react-icons/io";
import styles from "./Page2.module.css";

const Page2 = ({
  setPage,
  page,
  formData,
  setFormData,
  handleFileSelect,
  errors,
  selectedFile,
  setErrors,
}) => {
  return (
    <div className={styles.form}>
      <h2>House rules</h2>

      <div className={styles.selection}>
        <p>Pets allowed?</p>
        <div className={styles.selector } style={{width:"28%"}}>
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

      <div className={styles.selection} >
        <p>Smoking allowed?</p>
        <div className={styles.selector} style={{width:"28%"}} >
          <div className={styles.selectionRadion} >
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
        <span onClick={() => setPage(1)}>{"< Back"}</span>
        <button onClick={() => setPage(3)}>Next</button>
      </div>
    </div>
  );
};

export default Page2;
