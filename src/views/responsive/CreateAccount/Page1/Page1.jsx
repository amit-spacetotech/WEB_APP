import React, { useState } from "react";
import SimpleInput from "@/components/common/simpleInput";
import { DatePicker, Space, Select } from "antd";
import styles from "./Page1.module.css";

const Page1 = ({
  formData,
  setFormData,
  validateBasicForm,
  errors,
  handleChangeLocation,
  cities,
}) => {
  const [date, setDate] = useState(false);
  const handleDateChange = (value, date) => {
    setDate(value);
    setFormData({ ...formData, dob: date, tempDate: value });
    // setSelectedDate(date);
  };
  const handleChange = (value) => {
    setFormData({ ...formData, gender: value });
  };

  return (
    <div className={styles.page}>
      <div className={styles.formDiv}>
        <h1>Basic Details</h1>
        <SimpleInput
          placeholder="First name"
          type="text"
          value={formData.firstName}
          onChange={(e) => {
            const regex = /^[a-zA-Z]*$/; // regular expression to match alphabets only
            if (regex.test(e.target.value)) {
              if (e.target.value.length <= 15) {
                setFormData({ ...formData, firstName: e.target.value });
              }
            }
          }}
          style={{ marginTop: "10px" }}
        />
        {errors && errors.firstName && (
          <span className={styles.error}>{errors.firstName}</span>
        )}
        <SimpleInput
          placeholder="Last name"
          type="text"
          value={formData.lastName}
          onChange={(e) => {
            const regex = /^[a-zA-Z]*$/; // regular expression to match alphabets only
            if (regex.test(e.target.value)) {
              if (e.target.value.length <= 15) {
                setFormData({ ...formData, lastName: e.target.value });
              }
            }
          }}
        />
        {errors && errors.lastName && (
          <span className={styles.error}>{errors.lastName}</span>
        )}
        <DatePicker
          className="dateProfile"
          format="YYYY-MM-DD"
          inputReadOnly
          value={formData.tempDate}
          onChange={handleDateChange}
          placeholder="Birthday"
        />
        {/* <input
          placeholder="Birthday"
          type={date ? "date" : "text"}
          onFocus={() => setDate(true)}
          onBlur={() => setDate(false)}
        /> */}
        {errors && errors.dob && (
          <span className={styles.error}>{errors.dob}</span>
        )}
        <Select
          defaultValue={formData.gender ? formData.gender : null}
          placeholder="Gender"
          className={`profileSelect mobileSelect ${
            formData.gender && "genderColorChange"
          }`}
          style={{
            color: `${formData.gender ? "black" : "#8b8b8b"}`,
            marginTop: "8px",
          }}
          onChange={handleChange}
          options={[
            {
              label: "Male",
              value: "Male",
            },
            {
              label: "Female",
              value: "Female",
            },
            {
              label: "Others",
              value: "Others",
            },
          ]}
        />
        {/* <select
          style={{ color: `${formData.gender ? "black" : "#8b8b8b"}` }}
          placeholder="Gender"
          value={formData.gender}
          onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
        >
          <option value="" disabled>
            Gender
          </option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Others">Others</option>
        </select> */}
        {errors && errors.gender && (
          <span className={styles.error}>{errors.gender}</span>
        )}

        <Select
          value={formData.location}
          onChange={handleChangeLocation}
          className={`profileSelect mobileSelect ${
            formData.location === "Location" && "colorChangeSelect"
          }`}
          style={{
            color: `${formData.location !== "Location" ? "black" : "#8b8b8b"}`,
            marginTop: "8px",
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
        {errors && errors.location && (
          <span className={styles.error}>{errors.location}</span>
        )}
        <button
          onClick={() => {
            validateBasicForm();
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Page1;
