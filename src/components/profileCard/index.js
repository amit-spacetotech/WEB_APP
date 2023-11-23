import React, { useState } from "react";
import NewImg from "../../assets/profile/Group 5532.png";
import styles from "./style.module.css";
import { MdLocationOn } from "react-icons/md";
import { MdVerifiedUser } from "react-icons/md";
import { checkAge } from "@/utils/checkAge";
import dynamic from "next/dynamic";
import { FaRegEdit } from "react-icons/fa";
import { useRouter } from "next/router";
import { MdFavorite, MdOutlineFavoriteBorder } from "react-icons/md";
import { IoIosArrowBack } from "react-icons/io";
import { Carousel } from "antd";
const ProfileImg = dynamic(() => import("@/components/common/profile"), {
  ssr: false,
});
function ProfileCard({ data, property = false, ...props }) {
  const contentStyle = {
    margin: 0,
    height: "160px",
    color: "#f8cd46",
    lineHeight: "160px",
    textAlign: "center",
    background: "#364d79",
  };
  const router = useRouter();
  const [profileImg, setProfileImg] = useState(false);
  function toCamelCase(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }
  function checkUserHomeIdExists() {
    return (
      props.favoritesList &&
      props.favoritesList.some((obj) => obj.homeId === router.query._id)
    );
  }
  const filteredArray =
    data.home && data.home.images.filter((item) => item !== null);
  return (
    <div className={styles.profileCard}>
      {profileImg && (
        <ProfileImg
          setShow={() => setProfileImg(false)}
          show={profileImg}
          images={property.images ?? property.userProperty.images}
        />
      )}
      <div className={styles.mainImage}>
        <div
          className={styles.mobileBack}
          onClick={() => {
            router.push("/");
            props.getHouseMates(1, 9, "");
          }}
        >
          <IoIosArrowBack fontSize="1.25rem" cursor="pointer" />
        </div>
        {!router.query._id && (
          <div className={styles.profileSvg}>
            <FaRegEdit
              color="#FFFFFF"
              cursor="pointer"
              onClick={() =>
                props.setEdit({
                  ...props.edit,
                  field: ["propertyPic"],
                  open: true,
                })
              }
            />
          </div>
        )}
        {router.query._id && router.query._id && (
          <div
            className={
              checkUserHomeIdExists()
                ? styles.activeFavorite
                : styles.favoriteBg
            }
          >
            {checkUserHomeIdExists() ? (
              <MdFavorite
                color="red"
                onClick={() => props.deleteHomeFavorite(router.query._id)}
              />
            ) : (
              <MdOutlineFavoriteBorder
                color="#5B5B5B"
                onClick={() => props.addHomeFavorite(router.query._id)}
              />
            )}
          </div>
        )}
     
          <Carousel dotWidth={40}>
            {filteredArray &&
              filteredArray.length > 0 &&
              filteredArray.map((v, i) => {
                return (
                  <img
                    src={data.home ? data.home.images[i] : NewImg}
                    className={styles.thumbnail}
                    onClick={() => setProfileImg(true)}
                    style={{ height: property && "350px" }}
                  />
                );
              })}
          </Carousel>
      </div>

      <div className={`${"d-flex mt-3"} ${styles.content}`}>
        <div style={{ width: "100%" }}>
          <div className="d-flex justify-content-between">
            <p className={`fs-10 mb-0 fw-bolder ${styles.name}`}>
              {data.user &&
                data.user.firstName &&
                toCamelCase(data?.user?.firstName)}
              's home
              <MdVerifiedUser
                color="#3BD600"
                style={{ marginLeft: "0.3rem" }}
              />
              {!router.query._id && (
                <FaRegEdit
                  onClick={() =>
                    props.setEdit({
                      ...props.edit,
                      field: ["firstName"],
                      open: true,
                    })
                  }
                  color="#B3B3B3"
                  size="0.8rem"
                  cursor="pointer"
                  style={{ marginLeft: "0.8rem" }}
                />
              )}
            </p>
            <p className="fs-10 mb-0">
              {" "}
              <span> {/* <FaMoneyBillAlt color="#3ca244" />{" "} */}</span>{" "}
              {data.home.currencyType} {data?.home?.rent}/month
              {!router.query._id && (
                <FaRegEdit
                  color="#B3B3B3"
                  size="0.8rem"
                  cursor="pointer"
                  style={{ marginLeft: "0.8rem" }}
                  onClick={() =>
                    props.setEdit({
                      ...props.edit,
                      field: ["rentalBudget"],
                      open: true,
                    })
                  }
                />
              )}
            </p>
          </div>

          <div className="d-flex justify-content-between ">
            <p className="fs-10 mb-0">
              {" "}
              <span>
                <MdLocationOn color="#606060" />
              </span>{" "}
              {data?.user?.location}
              {!router.query._id && (
                <FaRegEdit
                  color="#B3B3B3"
                  size="0.8rem"
                  cursor="pointer"
                  style={{ marginLeft: "0.8rem" }}
                  onClick={() =>
                    props.setEdit({
                      ...props.edit,
                      field: ["location"],
                      open: true,
                    })
                  }
                />
              )}
            </p>
            {/* {property && ( */}
            <p className="fs-10 mb-0">
              {" "}
              Deposit of {data.home.currencyType} {data.home.deposit}{" "}
              {!router.query._id && (
                <FaRegEdit
                  color="#B3B3B3"
                  size="0.8rem"
                  cursor="pointer"
                  style={{ marginLeft: "0.8rem" }}
                  onClick={() =>
                    props.setEdit({
                      ...props.edit,
                      field: ["deposit"],
                      open: true,
                    })
                  }
                />
              )}
            </p>
            {/* )} */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;
