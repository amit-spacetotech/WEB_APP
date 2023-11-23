import Image from "next/image";
import React, { useEffect } from "react";
import MainImg from "../../../assets/landing/Group 5510.png";
import styles from "./style.module.css";
import { Button } from "react-bootstrap";
import { FiSearch } from "react-icons/fi";
import { MdOutlineLocationSearching } from "react-icons/md";
import Img1 from "../../../assets/landing/Image 2.png";
import Img2 from "../../../assets/landing/Image 3.png";
import Img3 from "../../../assets/landing/Image 4.png";
import Img4 from "../../../assets/landing/Group 5547.png";
import Img5 from "../../../assets/landing/Image 6.png";
import Img6 from "../../../assets/landing/Group 5548.png";
import Img7 from "../../../assets/landing/Group 5549.png";
import Img8 from "../../../assets/landing/Image 14.png";
import Img9 from "../../../assets/landing/Image 15.png";
import Img10 from "../../../assets/landing/Ellipse 3.png";
import oneToTwo from "../../../assets/landing/oneToTwo.svg";
import twoToThree from "../../../assets/landing/twoToThree.svg";
import threeToFour from "../../../assets/landing/threeToFour.svg";
import fourToFive from "../../../assets/landing/fourToFive.svg";
import Slider from "react-slick";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { useState } from "react";
import {
  getCities,
  getTestimonials,
} from "../../../redux/actions/contentAction";
import { connect } from "react-redux";
import CommonModal from "@/components/common/modal";
import CreateProfile from "../CreateProfile/createProfile";
import { useMediaQuery } from "react-responsive";
import { useRouter } from "next/router";
import { getUser } from "@/redux/actions/auth";

const Landingpage = (props) => {
  const router = useRouter();
  const [step, setStep] = React.useState(0);
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState(false);
  const [currentSlider, setCurrentSlider] = useState(0);
  const [testimonial, setTestimonial] = useState([]);
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 700px)" });
  const [openProfileModal, setProfileModal] = React.useState(false);

  const handleChange = (current) => {
    setCurrentSlider(null);
    setCurrentSlider(current);
  };

  const handleInputChange = (event) => {
    const value = event.target.value;
    if (/^[a-zA-Z0-9\s]*$/.test(value)) {
      setInputValue(value);

      if (value.length <= 0) {
        setSuggestions(false);
      }
      // Perform suggestion filtering based on value
      if (value.length > 0) {
        const filteredSuggestions =
          props.cities &&
          props.cities.filter((city) =>
            city.toLowerCase().startsWith(value.toLowerCase())
          );
        setSuggestions(filteredSuggestions);
      }
    }
  };
  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    setSuggestions(false);
  };

  useEffect(() => {
    setProfileModal(
      props.auth.user &&
        props.auth.user !== "NO_USER" &&
        !props.auth.user.userProfile
    );
  }, []);

  useEffect(() => {
    if (!props.testimonial) {
      props.getTestimonials();
    }
  }, [props.testimonial, isTabletOrMobile]);
  React.useEffect(() => {
    if (!props.cities) {
      props.getCities();
    }
  }, [props.cities]);

  var settings = {
    dots: false,
    infinite: props.testimonial && props.testimonial.length > 3,
    className: "slickIndex webLanding",
    speed: 500,
    nextArrow: <LandingNextArrow />,
    prevArrow: <LandingPrevArrow />,
    afterChange: (current) => handleChange(current),
    slidesToShow: 3,
    slidesToScroll: 1,
  };

  function LandingNextArrow(props) {
    const { className, style, onClick } = props;
    return (
      <BsChevronRight
        onClick={onClick}
        className={className}
        style={{
          ...style,
          color: "orange",
          cursor: "pointer",
          display: "block",
          width: "60px",
          height: "60px",
          fontWeight: "400",
        }}
      />
    );
  }

  function LandingPrevArrow(props) {
    const { className, style, onClick } = props;
    return (
      <BsChevronLeft
        onClick={onClick}
        className={className}
        style={{
          ...style,
          color: "orange",
          display: "block",
          cursor: "pointer",
          width: "60px",
          height: "60px",
        }}
      />
    );
  }

  const hiwArr = [
    {
      img: Img1,
      title: "1. Create account",
      description:
        "Provide some details about yourself that a potential housemate would like to know. Creating a profile is completely free at HomeShare",
    },
    {
      img: Img3,
      title: "3. Connect",
      description:
        "Use HomeShare's inbox to get in touch with your potential housemate, ask questions you might have to determine whether you are compatible or not.",
    },
    {
      img: Img5,
      title: "5. Move in",
      description:
        "Once you have found your perfect housemate, move in and start living together.",
    },
    {
      img: Img2,
      title: "2. Explore",
      description:
        "See the profiles of other people also looking for housemates, their interests, some of their personality traits & whether they have a home or not.",
    },

    {
      img: Img4,
      title: "4. Meet up",
      description:
        "To ensure the safety of everyone using HomeShare, all users are required to create a profile and verify their identities before being allowed to interact with other users.",
    },
  ];

  return (
    <div>
      <CommonModal
        className="userProfile"
        size="lg"
        userprofile={true}
        hideCross={true}
        step={step}
        getUser={props.getUser}
        show={openProfileModal}
        setShow={() => {
          setProfileModal(false);
        }}
        bodyContent={<CreateProfile setStep={setStep} step={step} />}
      />

      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.head}>
            <h1>
              Find your <span style={{ color: "#f8cd46" }}>perfect</span>{" "}
              housemate
            </h1>
            <p
              style={{ fontWeight: "500" }}
            >{`It’s not ‘what’ you live in; it’s ‘who’ you live with.`}</p>
            <div className={styles.searchBar}>
              <MdOutlineLocationSearching className={styles.locationSvg} />
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder={`Enter a neighbourhood or city`}
              />
              <Button
                onClick={() => {
                  inputValue && router.push(`/guest?location=${inputValue}`);
                }}
              >
                <span style={{ marginRight: "5px" }}>
                  <FiSearch fontSize="20px" margin="10px" />
                </span>{" "}
                Search{" "}
              </Button>
            </div>
            {suggestions && (
              <div className={styles.suggestion}>
                {suggestions.length > 0 && (
                  <ul className={styles.suggestionList}>
                    {suggestions.map((suggestion, index) => (
                      <li
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
          <Image src={MainImg} alt="homeshare" />
        </div>
      </div>

      <div style={{ width: "90%", margin: "auto" }}>
        <div className={styles.hiw}>
          <h1>
            How it <span style={{ color: "#f8cd46" }}>works</span>
          </h1>
          <div className={styles.content2}>
            {hiwArr?.map((v, i) => {
              return (
                <div key={i} className={styles.card}>
                  <Image
                    src={v?.img}
                    className={styles.cardImg}
                    alt="homeshare"
                  />
                  {i === 0 && (
                    <img
                      src={oneToTwo.src}
                      className={styles.leftJoin}
                      alt="homeshare"
                    />
                  )}
                  {i === 2 && (
                    <img
                      src={fourToFive.src}
                      className={styles.fourToFive}
                      alt="homeshare"
                    />
                  )}
                  {i === 3 && (
                    <img
                      src={twoToThree.src}
                      className={styles.twoToThree}
                      alt="homeshare"
                    />
                  )}
                  {i === 1 && (
                    <img
                      src={threeToFour.src}
                      className={styles.threeToFour}
                      alt="homeshare"
                    />
                  )}

                  <h4 className="fw-bolder">{v?.title}</h4>
                  <p>{v?.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className={styles.wif}>
          <h1>
            Who <span style={{ color: "#f8cd46" }}>is it for</span>
          </h1>
          <div className={styles.content3}>
            <img src={Img6.src} alt="homeshare" />
            <img src={Img7.src} alt="homeshare" />
          </div>
        </div>

        <div className={styles.wmu}>
          <h1>
            What makes us<span style={{ color: "#f8cd46" }}> unique</span>
          </h1>
          <div className={styles.content4}>
            <div className={styles.card}>
              <Image src={Img8} alt="homeshare" />
              <h4 className={styles.leftContenth4}>People centered</h4>
              <p className={styles.leftContenth4}>
                {" "}
                People are at the center of all we do. As our moto goes "its not
                what you live in; its you <strong>who</strong> live with."
              </p>
            </div>
            <div className={styles.card}>
              <Image src={Img9} alt="homeshare" />
              <h4 className={styles.rightContenth4}>Safety first</h4>
              <p
                className={styles.rightContenth4}
              >{`To ensure the safety of everyone using HomeShare, all users are required to create a profile and verify their identities before being allowed to interact with other users.`}</p>
            </div>
          </div>
        </div>

        <div className={styles.wps}>
          <h1>
            What are people<span style={{ color: "#f8cd46" }}> saying?</span>
          </h1>
          <div className={styles.aboutPeople}>
            <Slider {...settings}>
              {props.testimonial &&
                props.testimonial.map((v, i) => {
                  return (
                    <div
                      key={i}
                      className={` ${
                        currentSlider === i - 1 ||
                        (props.testimonial.length - 1 === currentSlider &&
                          0 === i)
                          ? styles.midCard
                          : styles.sideCard
                      }`}
                    >
                      <hr />
                      <p className={`${styles.text}`}>{v.description}</p>
                      <div className={styles.inner}>
                        <img src={v?.image ?? Img10.src} alt="homeshare" />
                        <div className={styles.innerText}>
                          <h4>{v.name}</h4>
                          <p>{v?.position}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </Slider>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    testimonial: state.content.testimonials,
    cities: state.content.cities,
  };
};

export default connect(mapStateToProps, {
  getTestimonials,
  getCities,
  getUser,
})(Landingpage);
