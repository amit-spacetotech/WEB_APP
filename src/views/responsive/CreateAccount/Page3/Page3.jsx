import React from "react";
import styles from "./Page3.module.css";
import { IoIosArrowBack } from "react-icons/io";

const Page3 = ({
  setPage,
  page,
  formData,
  setFormData,
  errors,
  validateLifeStyleForm,
}) => {
  return (
    <div className={styles.page}>
      <div className={styles.formDiv}>
        <h1>About your lifestyle</h1>
        <div className={styles.flex1}>
          <div className={styles.halfWidth}>
            <label className={styles.label}>Monthly Budget</label>
            <input
              placeholder="0"
              type="number"
              className={styles.fullTextField}
              value={formData.rentalBudget}
              onChange={(e) => {
                const inputValue = e.target.value;

                if (
                  inputValue === "" ||
                  (inputValue > 0 && inputValue.length <= 6)
                ) {
                  setFormData({
                    ...formData,
                    rentalBudget: e.target.value,
                  });
                }
              }}
            />
            {errors && errors.rentalBudget && (
              <span className={styles.error}>{errors.rentalBudget}</span>
            )}
          </div>
          <div className={styles.halfWidth}>
            <label className={styles.label}></label>
            <select
              name="currencies"
              style={{ color: `${formData.currency ? "black" : "#8b8b8b"}` }}
              value={formData.currency}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  currency: e.target.value,
                });
              }}
            >
              <option selected value="">
                Select currency
              </option>
              {/* <option value="$">Dollar</option> */}
              <option value="R">Rand</option>
              {/* <option value="£">Pond</option>
              <option value="€">Euro</option> */}
            </select>
            {errors && errors.currency && (
              <span className={styles.error}>{errors.currency}</span>
            )}
          </div>
        </div>

        <div className={styles.equalMargin}>
          <label className={styles.label}>Do you have pets?</label>
          <div className={styles.flex} style={{ justifyContent: "flex-start" }}>
            <div
              className={`${styles.flex} ${styles.equalMargin}`}
              style={{
                alignItems: "center",
                justifyContent: "flex-start",
                width: "28%",
              }}
            >
              <input
                type="radio"
                checked={formData.havePets}
                value={formData.havePets}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    havePets: true,
                  });
                }}
              />
              <label className={styles.label} style={{ marginLeft: "5px" }}>
                Yes
              </label>
            </div>
            <div
              className={`${styles.flex} ${styles.equalMargin}`}
              style={{
                alignItems: "center",
                justifyContent: "flex-start",
                width: "28%",
              }}
            >
              <input
                type="radio"
                checked={!formData.havePets}
                value={formData.havePets}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    havePets: false,
                  });
                }}
              />
              <label className={styles.label} style={{ marginLeft: "5px" }}>
                No
              </label>
            </div>
            <div className={styles.flex}></div>
          </div>
        </div>

        <div className={styles.equalMargin}>
          <label className={styles.label}>
            What is your capacity for people?
          </label>

          <div
            className={`${styles.flex} ${styles.lessMargin}`}
            style={{ alignItems: "center", justifyContent: "flex-start" }}
          >
            <div
              className={styles.flex}
              style={{
                alignItems: "center",
                width: "28%",
                justifyContent: "flex-start",
              }}
            >
              <input
                type="radio"
                checked={formData.peopleCapacity === "Introvert"}
                value={formData.peopleCapacity}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    peopleCapacity: "Introvert",
                  });
                }}
              />
              <label className={styles.label} style={{ marginLeft: "5px" }}>
                Introvert
              </label>
            </div>
            <div
              className={`${styles.flex} ${styles.equalMargin}`}
              style={{
                alignItems: "center",
                width: "28%",
                justifyContent: "flex-start",
              }}
            >
              <input
                type="radio"
                checked={formData.peopleCapacity === "Extrovert"}
                value={formData.peopleCapacity}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    peopleCapacity: "Extrovert",
                  });
                }}
              />
              <label className={styles.label} style={{ marginLeft: "5px" }}>
                {" "}
                Extrovert
              </label>
            </div>
            <div
              className={`${styles.flex} ${styles.equalMargin}`}
              style={{
                alignItems: "center",
                width: "28%",
                justifyContent: "flex-start",
              }}
            >
              <input
                type="radio"
                checked={formData.peopleCapacity === "Ambivert"}
                value={formData.peopleCapacity}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    peopleCapacity: "Ambivert",
                  });
                }}
              />
              <label className={styles.label} style={{ marginLeft: "5px" }}>
                Ambivert
              </label>
            </div>
          </div>
          {errors && errors.peopleCapacity && (
            <span className={styles.error}>{errors.peopleCapacity}</span>
          )}
        </div>

        <div style={{ margin: "0.5rem 0" }}>
          <label className={styles.label}>
            Do you identify with a specific religion?
          </label>

          <select
            name="religion"
            value={formData.religion}
            style={{ color: `${formData.religion ? "black" : "#8b8b8b"}` }}
            className={styles.religion}
            onChange={(e) =>
              setFormData({ ...formData, religion: e.target.value })
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
        </div>
        {errors && errors.religion && (
          <span className={styles.error}>{errors.religion}</span>
        )}
        <div className={styles.buttonDiv}>
          <div onClick={() => setPage(page - 1)}>
            <IoIosArrowBack fontSize="20px" />
            Back
          </div>
          <button onClick={() => validateLifeStyleForm()}>Next</button>
        </div>
      </div>
    </div>
  );
};

export default Page3;
