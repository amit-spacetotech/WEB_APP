import React from "react";
import styles from "./Page.module.css";
import { AiOutlinePlusCircle, AiOutlineMinusCircle } from "react-icons/ai";
import { DatePicker, Space } from "antd";

const Page4 = ({
  handleDeacrement,
  handleIncreament,
  formData,
  setFormData,
  errors,
  validateAvailabilityForm,
  setPage,
}) => {
  const handleDateChange = (value, date) => {
    setFormData({ ...formData, availableFrom: date, tempDate: value });
    // setSelectedDate(date);
  };
  const disabledDate = (current) => {
    // Get today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Disable if the current date is before today
    return current && current < today;
  };
  return (
    <div className={styles.form}>
      <h2>Availability</h2>

      <div className={styles.selection} style={{ marginBottom: "0.4rem" }}>
        <p>No. of available rooms</p>
        <div className={styles.selector}>
          <AiOutlineMinusCircle
            size="0.9rem"
            onClick={() => {
              formData.availableRooms > 1 && handleDeacrement("availableRooms");
            }}
          />
          <h3>{formData.availableRooms}</h3>{" "}
          <AiOutlinePlusCircle
            size="0.9rem"
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
        </div>
      </div>
      {errors && errors.availableFrom && (
        <span className={styles.error}>{errors.availableFrom}</span>
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
                (inputValue > 0 && inputValue.length <3)
              ) {
                setFormData({ ...formData, minLeasePeriod: e.target.value });
              }
            }}
          />
        </div>
      </div>
      {errors && errors.minLeasePeriod && (
        <span className={styles.error}>{errors.minLeasePeriod}</span>
      )}

      <div className={styles.flexComp}>
        <span onClick={() => setPage(3)}>{"< Back"}</span>
        <button onClick={() => validateAvailabilityForm()}>Next</button>
      </div>
    </div>
  );
};

export default Page4;
