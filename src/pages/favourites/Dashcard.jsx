import React from "react";
import styles from "../../views/web/HomePage/home.module.css";
import { MdLocationOn, MdFavorite, MdVerifiedUser } from "react-icons/md";
import { FaMoneyBillAlt } from "react-icons/fa";
import { useRouter } from "next/router";

function DashCard(props) {
  const router = useRouter();

  const checkAge = () => {
    const dateOfBirthString = props.dob;
    const dateOfBirth = new Date(dateOfBirthString);
    const today = new Date();
    console.log(props, "TODAY");
    let age = today.getFullYear() - dateOfBirth.getFullYear();
    const monthDiff = today.getMonth() - dateOfBirth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())
    ) {
      age--;
    }
    return isNaN(age) ? 0 : age;
  };

  return (
    <div className={styles.card}>
      <img
        src={props.image}
        alt="image"
        className={styles.thumbnail}
        onClick={() => {
          if (!props.haveProfile) {
            alert("Please create your profile");
            return;
          } else {
            props.checkUserProfile
              ? router.push(`/mates?_id=${props._id}`)
              : router.push(`/matehome?_id=${props._id}`);
          }
        }}
      />
      <div className={styles.activeFavorite}>
        <MdFavorite
          color="#FF3A3A"
          onClick={() =>
            props.deleteFavorite(
              props.checkUserProfile
                ? { userProfileId: props._id }
                : { homeId: props._id }
            )
          }
        />
      </div>
      <div className="d-flex mt-1">
        <div style={{ width: "100%" }}>
          <div className="d-flex justify-content-between m-1">
            <h3 className="fs-10 mb-0 fw-bolder d-flex align-center">
              {props.firstName ? props.firstName : "N/A"},{checkAge()}{" "}
              {props.showSecurity && (
                <MdVerifiedUser
                  color="#3BD600"
                  style={{ marginLeft: "0.3rem" }}
                />
              )}
            </h3>
            <p className="fs-10 mb-0">
              <span style={{ margin: "0 3px" }}>R</span>
              {props.rent ? props.rent : 0}
              /month
            </p>
          </div>
          <p className="fs-10 mb-0">
            {" "}
            <span>
              <MdLocationOn color="#83dfe9" />
            </span>{" "}
            {props.location ? props.location : "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default DashCard;
