import React from "react";
import { IoIosArrowBack } from "react-icons/io";
import { IoAddCircleOutline } from "react-icons/io5";

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
  const handleRemoveImage = (indexToRemove) => {
    const updatedImages = [...formData.images];

    if (indexToRemove >= 0 && indexToRemove < updatedImages.length) {
      updatedImages[indexToRemove] = null;
      setFormData({ ...formData, images: updatedImages });
    }
  };
  return (
    <div className={styles.page}>
      <div className={styles.formDiv}>
        <h1>Its photo time!</h1>
        <p>
          Add some photos of yourself. Make sure your face is visible & that
          your photos tell a story of who you are.
        </p>
        <div className={styles.innerDiv}>
          {selectedFile && (
            <span className={styles.error}>Image uploading please wait</span>
          )}
          {errors && errors.image && (
            <span className={styles.error}>{errors.image}</span>
          )}

          <div
            className={styles.rightPhoto}
            style={{ pointerEvents: selectedFile ? "none" : "unset" }}
          >
            <div className={styles.upload_box}>
              <label htmlFor={`file-input-0`}>
                {formData.images.length > 0 && formData.images[0] ? (
                  <img
                    src={formData.images[0]}
                    alt="Selected file"
                    className={styles.upload_img}
                  />
                ) : (
                  <span>
                    <IoAddCircleOutline />
                  </span>
                )}
              </label>
              <input
                id={`file-input-0`}
                accept="image/*"
                type="file"
                style={{ display: "none" }}
                onChange={(e) => handleFileSelect(e, 0)}
              />
            </div>

            <div className={styles.upload_box}>
              {formData.images[1] && (
                <svg
                  className={styles.crossIconSM}
                  onClick={() => handleRemoveImage(1)}
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
              <label htmlFor={`file-input-1`}>
                {formData.images.length > 0 && formData.images[1] ? (
                  <img src={formData.images[1]} alt="Selected file" />
                ) : (
                  <span>
                    <IoAddCircleOutline />
                  </span>
                )}
              </label>
              <input
                id={`file-input-1`}
                accept="image/*"
                type="file"
                style={{ display: "none" }}
                onChange={(e) => handleFileSelect(e, 1)}
              />
            </div>
            <div className={styles.upload_box}>
              {formData.images[2] && (
                <svg
                  className={styles.crossIconSM}
                  onClick={() => handleRemoveImage(2)}
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
              <label htmlFor={`file-input-2`}>
                {formData.images.length > 0 && formData.images[2] ? (
                  <img src={formData.images[2]} alt="Selected file" />
                ) : (
                  <span>
                    <IoAddCircleOutline />
                  </span>
                )}
              </label>
              <input
                id={`file-input-2`}
                accept="image/*"
                type="file"
                style={{ display: "none" }}
                onChange={(e) => handleFileSelect(e, 2)}
              />
            </div>
          </div>
        </div>
        <div className={styles.buttonDiv}>
          <div onClick={() => setPage(page - 1)}>
            <IoIosArrowBack fontSize="20px" /> Back
          </div>
          <button
            onClick={() => {
              if (!formData.images[0]) {
                setErrors({
                  image: "*Please upload main image",
                });
              } else {
                setPage(3);
              }
            }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page2;
