import React, { useState } from "react";
import SimpleInput from "@/components/common/simpleInput";

import styles from "./Page1.module.css";
import { AiOutlinePlusCircle, AiOutlineMinusCircle } from "react-icons/ai";

const Page1 = ({
  formData,
  setFormData,
  validateBasicForm,
  errors,
  handleDeacrement,
  handleIncreament,
}) => {
  const [date, setDate] = useState(false);

  return (
    <div className={styles.form}>
      <h2>About my home</h2>

      <div className={styles.selection}>
        <p style={{ color: "#606060" }}>Bedrooms</p>
        <div className={styles.selector}>
          <AiOutlineMinusCircle
            onClick={() => {
              if (formData.bedRooms > 1) {
                handleDeacrement("bedRooms");
              }
            }}
            size="0.9rem"
          />
          <h3>{formData.bedRooms}</h3>
          <AiOutlinePlusCircle
            onClick={() => handleIncreament("bedRooms")}
            size="0.9rem"
          />
        </div>
      </div>

      <div className={styles.selection}>
        <p style={{ color: "#606060" }}>Bathrooms</p>
        <div className={styles.selector}>
          <AiOutlineMinusCircle
            onClick={() => {
              formData.bathRooms > 1 && handleDeacrement("bathRooms");
            }}
            size="0.9rem"
          />
          <h3>{formData.bathRooms}</h3>{" "}
          <AiOutlinePlusCircle
            onClick={() => handleIncreament("bathRooms")}
            size="0.9rem"
          />
        </div>
      </div>
      <div className={styles.selection}>
        <p style={{ color: "#606060" }}>Living rooms</p>
        <div className={styles.selector}>
          <AiOutlineMinusCircle
            onClick={() => {
              formData.livingrooms > 1 && handleDeacrement("livingrooms");
            }}
            size="0.9rem"
          />
          <h3>{formData.livingrooms}</h3>
          <AiOutlinePlusCircle
            onClick={() => handleIncreament("livingrooms")}
            size="0.9rem"
          />
        </div>
      </div>

      <div className={styles.selection}>
        <p>Do you have a garden?</p>
        <div className={styles.selector} style={{ width: "28%" }}>
          <div className={styles.selectionRadion}>
            <input
              type="radio"
              value={formData.haveGarden}
              checked={formData.haveGarden}
              onChange={() => setFormData({ ...formData, haveGarden: true })}
            />
            <label>Yes</label>
          </div>
          <div className={styles.selectionRadion}>
            <input
              type="radio"
              value={formData.haveGarden}
              checked={!formData.haveGarden}
              onChange={() => setFormData({ ...formData, haveGarden: false })}
            />
            <label>No</label>
          </div>
          <div></div>
        </div>
      </div>

      <div className={styles.selectionInput}>
        <label>What is the size of your property in m^2?</label>
        <input
          type="number"
          placeholder="0"
          value={formData.size}
          onChange={(e) => {
            const inputValue = e.target.value;
            if (
              inputValue === "" ||
              (inputValue > 0 && inputValue.length <= 6)
            ) {
              setFormData({ ...formData, size: e.target.value });
            }
          }}
        />
      </div>
      {errors && errors.size && (
        <span className={styles.error}>{errors.size}</span>
      )}
      <button className={styles.nextBtn} onClick={() => validateBasicForm()}>
        Next
      </button>
    </div>
  );
};

export default Page1;
