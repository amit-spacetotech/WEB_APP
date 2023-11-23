import styles from "./Page.module.css";
const Page6 = ({ handleCreateProfile, formData, setPage, setFormData ,errors,setErrors}) => {
  return (
    <div className={styles.form}>
      <h2>Tell us more</h2>
      <p>Anything else you would like to share about your home?</p>
      <textarea
        value={formData.about}
        onChange={(e) => setFormData({ ...formData, about: e.target.value })}
        type="text"
        className={styles.description}
        placeholder="Time to tell your potential housemate how incredible your place is..."
      />
      {errors && errors.about && (
        <span className={styles.error}>{errors.about}</span>
      )}
      <div className={styles.flexComp}>
        <span onClick={() => setPage(5)}>{"< Back"}</span>
        <button
          onClick={() => {
            formData.about
              ? handleCreateProfile()
              : setErrors({ ...errors, about: "Field is required" });
          }}
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default Page6;
