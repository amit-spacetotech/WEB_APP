import styles from "./Page.module.css";
import { FiPlusCircle } from "react-icons/fi";
const Page5 = ({
  handleFileSelect,
  formData,
  errors,
  selectedFile,
  setPage,
  setErrors,
  setFormData,
}) => {
  const handleRemoveImage = (indexToRemove) => {
    const updatedImages = [...formData.images];

    if (indexToRemove >= 0 && indexToRemove < updatedImages.length) {
      updatedImages[indexToRemove] = null;
      setFormData({ ...formData, images: updatedImages });
    }
  };
  return (
    <div className={styles.form}>
      <h2>Upload home pictures</h2>
      <p>
        Upload at least 4 pictures of your home. The better the quality of your
        photos , the easier you'll find a housemate.
      </p>
      {selectedFile && (
        <span className={styles.error}>*Image uploading please wait</span>
      )}

      <div
        className={styles.photosFlex}
        style={{ pointerEvents: selectedFile ? "none" : "unset" }}
      >
        <div className={styles.leftPhoto}>
          <div className={styles.upload_box}>
            <label htmlFor="file-input">
              {formData.images.length > 0 && formData.images[0] ? (
                <img src={formData.images[0]} alt="Selected file" />
              ) : (
                <FiPlusCircle />
              )}
            </label>
            <input
              id="file-input"
              type="file"
              accept="image/*"
              style={{ opacity: 0, width: "100%", position: "absolute" }}
              onChange={(e) => handleFileSelect(e, 0)}
            />
          </div>
        </div>
        <div className={styles.rightPhoto}>
          <div className={styles.upload_box}>
            {formData.images[1] && (
              <svg
                onClick={() => handleRemoveImage(1)}
                className={styles.crossIcon}
                xmlns="http://www.w3.org/2000/svg"
                width="36.532"
                height="36.532"
                viewBox="0 0 36.532 36.532"
              >
                <path
                  d="M18.266,0A18.266,18.266,0,1,0,36.532,18.266,18.286,18.286,0,0,0,18.266,0Zm0,0"
                  fill="#f44336"
                />
                <path
                  d="M169.371,167.218a1.522,1.522,0,1,1-2.153,2.153l-4.574-4.574-4.574,4.574a1.522,1.522,0,1,1-2.153-2.153l4.574-4.574-4.574-4.574a1.522,1.522,0,1,1,2.153-2.153l4.574,4.574,4.574-4.574a1.522,1.522,0,0,1,2.153,2.153l-4.574,4.574Zm0,0"
                  transform="translate(-144.378 -144.378)"
                  fill="#fafafa"
                />
              </svg>
            )}
            <label htmlFor="file-input">
              {formData.images.length > 0 && formData.images[1] ? (
                <img src={formData.images[1]} alt="Selected file" />
              ) : (
                <FiPlusCircle />
              )}
            </label>
            <input
              id="file-input"
              type="file"
              accept="image/*"
              style={{ opacity: 0, width: "100%", position: "absolute" }}
              onChange={(e) => handleFileSelect(e, 1)}
            />
          </div>
          <div className={styles.upload_box}>
            {formData.images[2] && (
              <svg
                onClick={() => handleRemoveImage(2)}
                className={styles.crossIcon}
                xmlns="http://www.w3.org/2000/svg"
                width="36.532"
                height="36.532"
                viewBox="0 0 36.532 36.532"
              >
                <path
                  d="M18.266,0A18.266,18.266,0,1,0,36.532,18.266,18.286,18.286,0,0,0,18.266,0Zm0,0"
                  fill="#f44336"
                />
                <path
                  d="M169.371,167.218a1.522,1.522,0,1,1-2.153,2.153l-4.574-4.574-4.574,4.574a1.522,1.522,0,1,1-2.153-2.153l4.574-4.574-4.574-4.574a1.522,1.522,0,1,1,2.153-2.153l4.574,4.574,4.574-4.574a1.522,1.522,0,0,1,2.153,2.153l-4.574,4.574Zm0,0"
                  transform="translate(-144.378 -144.378)"
                  fill="#fafafa"
                />
              </svg>
            )}
            <label htmlFor="file-input">
              {formData.images.length > 0 && formData.images[2] ? (
                <img src={formData.images[2]} alt="Selected file" />
              ) : (
                <FiPlusCircle />
              )}
            </label>
            <input
              id="file-input"
              accept="image/*"
              type="file"
              style={{ opacity: 0, width: "100%", position: "absolute" }}
              onChange={(e) => handleFileSelect(e, 2)}
            />
          </div>
          <div className={styles.upload_box}>
            {formData.images[3] && (
              <svg
                onClick={() => handleRemoveImage(3)}
                className={styles.crossIcon}
                xmlns="http://www.w3.org/2000/svg"
                width="36.532"
                height="36.532"
                viewBox="0 0 36.532 36.532"
              >
                <path
                  d="M18.266,0A18.266,18.266,0,1,0,36.532,18.266,18.286,18.286,0,0,0,18.266,0Zm0,0"
                  fill="#f44336"
                />
                <path
                  d="M169.371,167.218a1.522,1.522,0,1,1-2.153,2.153l-4.574-4.574-4.574,4.574a1.522,1.522,0,1,1-2.153-2.153l4.574-4.574-4.574-4.574a1.522,1.522,0,1,1,2.153-2.153l4.574,4.574,4.574-4.574a1.522,1.522,0,0,1,2.153,2.153l-4.574,4.574Zm0,0"
                  transform="translate(-144.378 -144.378)"
                  fill="#fafafa"
                />
              </svg>
            )}
            <label htmlFor="file-input">
              {formData.images.length > 0 && formData.images[3] ? (
                <img src={formData.images[3]} alt="Selected file" />
              ) : (
                <FiPlusCircle />
              )}
            </label>
            <input
              id="file-input"
              type="file"
              accept="image/*"
              style={{ opacity: 0, width: "100%", position: "absolute" }}
              onChange={(e) => handleFileSelect(e, 3)}
            />
          </div>
        </div>
      </div>
      {errors && errors.images && (
        <span className={styles.error}>{errors.images}</span>
      )}

      <div className={styles.flexComp}>
        <span onClick={() => setPage(4)}>{"< Back"}</span>
        <button
          onClick={() => {
            if (formData.images[0]) {
              setPage(6);
            } else {
              setErrors({ images: "Please upload main image" });
            }
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Page5;
