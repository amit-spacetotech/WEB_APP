import React from "react";
import styles from "./Page3.module.css";
import { IoIosArrowBack } from "react-icons/io";

const Page3 = ({
  setPage,
  page,
  formData,
  setFormData,
  errors,
  validatePricingForm,
}) => {
  return (
    <div className={styles.form}>
      <h2>Pricing</h2>

      <div className={styles.flex}>
        <div className={styles.halfWidth}>
          <label className={styles.label}>Rent per month</label>
          <input
            placeholder="0"
            type="number"
            className={styles.fullTextField}
            value={formData.rent}
            onChange={(e) => {
              const inputValue = e.target.value;
              if (
                inputValue === "" ||
                (inputValue > 0 && inputValue.length <= 6)
              ) {
                setFormData({ ...formData, rent: e.target.value });
              }
            }}
          />
          {errors && errors.rent && (
            <span className={styles.error}>{errors.rent}</span>
          )}
        </div>
        <div className={styles.halfWidth}>
          <label className={styles.label}></label>
          <select
            name="currencies"
            value={formData.currencyType}
            onChange={(e) => {
              setFormData({
                ...formData,
                currencyType: e.target.value,
              });
            }}
          >
            <option selected value="" disabled>
              Select currency
            </option>
            {/* <option value="$">Dollar</option> */}
            <option value="R">Rand</option>
            {/* <option value="£">Pond</option>
            <option value="€">Euro</option> */}
          </select>
          {errors && errors.currencyType && (
            <span className={styles.error}>{errors.currencyType}</span>
          )}
        </div>
      </div>

      <div className={styles.flex}>
        <div className={styles.halfWidth}>
          <label className={styles.label}>Deposit Required</label>
          <input
            placeholder="0"
            type="number"
            className={styles.fullTextField}
            value={formData.deposit}
            onChange={(e) => {
              const inputValue = e.target.value;
              if (
                inputValue === "" ||
                (inputValue > 0 && inputValue.length <= 6)
              ) {
                setFormData({ ...formData, deposit: e.target.value });
              }
            }}
          />
          {errors && errors.deposit && (
            <span className={styles.error}>{errors.deposit}</span>
          )}
        </div>
        <div className={styles.halfWidth}>
          <label className={styles.label}></label>
          <select
            name="currencies"
            value={formData.currencyType}
            onChange={(e) => {
              setFormData({
                ...formData,
                currencyType: e.target.value,
              });
            }}
          >
            <option selected value="" disabled>
              Select currency
            </option>
            {/* <option value="$">Dollar</option> */}
            <option value="R">Rand</option>
            {/* <option value="£">Pond</option>
            <option value="€">Euro</option> */}
          </select>
          {errors && errors.currencyType && (
            <span className={styles.error}>{errors.currencyType}</span>
          )}
        </div>
      </div>

      <div className={styles.selection}>
        <p>Water Included?</p>
        <div className={styles.selector}>
          <div className={styles.selectionRadion}>
            <input
              type="radio"
              checked={formData.isWaterIncluded}
              value={formData.isWaterIncluded}
              onChange={(e) =>
                setFormData({ ...formData, isWaterIncluded: true })
              }
            />
            <label>Yes</label>
          </div>
          <div className={styles.selectionRadion}>
            <input
              type="radio"
              checked={!formData.isWaterIncluded}
              value={formData.isWaterIncluded}
              onChange={(e) =>
                setFormData({ ...formData, isWaterIncluded: false })
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
              checked={formData.isElectricityIncluded}
              value={formData.isElectricityIncluded}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  isElectricityIncluded: true,
                })
              }
            />
            <label>Yes</label>
          </div>
          <div className={styles.selectionRadion}>
            <input
              type="radio"
              checked={!formData.isElectricityIncluded}
              value={formData.isElectricityIncluded}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  isElectricityIncluded: false,
                })
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
              checked={formData.isInternetIncluded}
              value={formData.isInternetIncluded}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  isInternetIncluded: true,
                })
              }
            />
            <label>Yes</label>
          </div>
          <div className={styles.selectionRadion}>
            <input
              type="radio"
              checked={!formData.isInternetIncluded}
              value={formData.isInternetIncluded}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  isInternetIncluded: false,
                })
              }
            />
            <label>No</label>
          </div>
          <div></div>
        </div>
      </div>
      <div className={styles.flexComp}>
        <span onClick={() => setPage(2)}>{"< Back"}</span>
        <button onClick={() => validatePricingForm()}>Next</button>
      </div>
    </div>
  );
};

export default Page3;
