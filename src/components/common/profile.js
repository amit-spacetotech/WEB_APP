import React, { useEffect } from "react";
import styles from "./style.module.css";
import { useGlobalStore } from "@/utils/store";
import Slider from "react-slick";
import { BsDownload } from "react-icons/bs";
import { RxCross2 } from "react-icons/rx";
import { IoIosArrowDropright, IoIosArrowDropleft } from "react-icons/io";
import { useState } from "react";
import { useRouter } from "next/router";
import { useMediaQuery } from "react-responsive";

function ProfileImg({ show, setShow, centered = true, images }) {
  const { profileImg, setProfileImg } = useGlobalStore((state) => state);
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 700px)" });
  const [currentSlider, setCurrentSlider] = useState(1);
  const router = useRouter();
  const filteredArray = images.filter((item) => item !== null);
  var settings = {
    dots: false,
    infinite: true,
    speed: 500,
    nextArrow: <LandingNextArrow />,
    prevArrow: <LandingPrevArrow />,
    afterChange: (current) => setCurrentSlider(current + 1),
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  // useEffect(() => {
  //  setProfileImg(false)
  // }, [router.pathname])
  function downloadFile(url) {
    const anchorElement = document.createElement("a");
    anchorElement.href = url;
    anchorElement.download = "";

    document.body.appendChild(anchorElement);
    anchorElement.click();
    document.body.removeChild(anchorElement);
  }
  function LandingNextArrow(props) {
    const { className, style, onClick } = props;
    return (
      <IoIosArrowDropright
        onClick={onClick}
        className={className}
        style={{
          ...style,
          color: "white",
          zIndex: 2,
          display: "block",
          width: `${isTabletOrMobile ? "30px" : "80px"}`,
          height: `${isTabletOrMobile ? "30px" : "80px"}`,
        }}
      />
    );
  }

  function LandingPrevArrow(props) {
    const { className, style, onClick } = props;
    return (
      <IoIosArrowDropleft
        onClick={onClick}
        className={className}
        style={{
          ...style,
          color: "white",
          zIndex: 2,
          display: "block",
          width: `${isTabletOrMobile ? "30px" : "80px"}`,
          height: `${isTabletOrMobile ? "30px" : "80px"}`,
        }}
      />
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div>
          <div className={styles.header}>
            <p onClick={() => setShow(false)} style={{ cursor: "pointer" }}>
              {" "}
              <span>
                <RxCross2 size="2rem" fontWeight="bolder" />{" "}
              </span>{" "}
              Close
            </p>
            <p>
              {currentSlider}/{filteredArray.length}
            </p>
            <p>
              <BsDownload
                onClick={
                  () => {
                    downloadFile(filteredArray[currentSlider - 1]);
                  }
                  // window.open(, "_blank")
                }
                size="1.8rem"
                fontWeight="bolder"
                style={{ marginRight: "1rem" }}
              />{" "}
              {/* <span>
                <MdFavoriteBorder size="2rem" fontWeight="bolder" />{" "}
              </span> */}
            </p>
          </div>
        </div>
        <div className={styles.slider}>
          <Slider {...settings}>
            {filteredArray.map((v, i) => {
              return (
                <div key={i} className={styles.carouselSetting}>
                  <img src={v} />
                </div>
              );
            })}
          </Slider>
        </div>
      </div>
    </div>
  );
}

export default ProfileImg;
