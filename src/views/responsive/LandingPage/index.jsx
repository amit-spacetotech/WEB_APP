import React, { useEffect, useState } from "react";
import styles from "./landing.module.css";
import { Button } from "react-bootstrap";
import { FiSearch } from "react-icons/fi";
import Group5517 from "../../../assets/landing/responsive/Group5517.svg";
import img1 from "../../../assets/landing/responsive/img1.png";
import img2 from "../../../assets/landing/responsive/img2.png";
import img3 from "../../../assets/landing/responsive/img3.png";
import img4 from "../../../assets/landing/responsive/img4.png";
import img5 from "../../../assets/landing/responsive/img5.png";
import img6 from "../../../assets/landing/responsive/img6.png";
import img7 from "../../../assets/landing/responsive/img7.png";
import img8 from "../../../assets/landing/responsive/img8.png";
import img9 from "../../../assets/landing/responsive/img9.png";
import img10 from "../../../assets/landing/responsive/img10.png";
import img11 from "../../../assets/landing/responsive/img11.png";
import img12 from "../../../assets/landing/responsive/img12.png";
import img13 from "../../../assets/landing/responsive/img13.png";
import { MdArrowForwardIos, MdArrowBackIos } from "react-icons/md";
import Slider from "react-slick";
import axios from "axios";
import Image from "next/image";
import {
  getCities,
  getTestimonials,
} from "../../../redux/actions/contentAction";
import { connect } from "react-redux";
import { useRouter } from "next/router";

const LandingResponsive = (props) => {
  const router = useRouter();
  const [currentSlider, setCurrentSlider] = useState(0);
  const [testimonial, setTestimonial] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState(false);
  useEffect(() => {
    var config = {
      method: "get",
      url: "/content/getTestimonial?page=1&search&limit=10",
      headers: {
        Authorization:
          "Basic SE9NRVNIQVJFOlJBTkRPTUhPTUVTSEFSRVBBU1NXT1JEUE9JVVlUUkVRV0VSVFlVSQ==",
      },
    };
    axios(config)
      .then(function (response) {
        // console.log(JSON.stringify(response.data));
        setTestimonial(response.data.testimonial);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);
  React.useEffect(() => {
    if (!props.cities) {
      props.getCities();
    }
  }, [props.cities]);
  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    setSuggestions(false);
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
  const handleChange = (current) => {
    setCurrentSlider(null);
    setCurrentSlider(current);
  };
  var settings = {
    dots: false,
    infinite: false,
    className: "slickIndex",
    speed: 500,
    nextArrow: <LandingNextArrow />,
    prevArrow: <LandingPrevArrow />,
    afterChange: (current) => handleChange(current),
    slidesToShow: 1.1,
    slidesToScroll: 1,
  };

  function LandingNextArrow(props) {
    const { className, onClick } = props;
    return (
      <div className={styles.arrowDiv1}>
        <MdArrowForwardIos
          onClick={onClick}
          className={`${className} ${styles.arrow1}`}
        />
      </div>
    );
  }

  function LandingPrevArrow(props) {
    const { className, onClick } = props;
    return (
      <div className={styles.arrowDiv}>
        <MdArrowBackIos
          onClick={onClick}
          className={`${className} ${styles.arrow}`}
        />
      </div>
    );
  }
  return (
    <div className={styles.mainContainer}>
      <div className={styles.findPerfect}>
        <div className={styles.head}>
          <h1>
            Find your <span style={{ color: "#f8cd46" }}>perfect</span>{" "}
          </h1>
          <h1>housemate.</h1>
        </div>
        <p
          className={styles.para}
        >{`It’s not ‘what’ you live in; it’s ‘who’ you live with.`}</p>

        <div className={styles.imagesFont}>
          <img src={Group5517.src} alt="img" />
        </div>

        <div className={styles.searchBar}>
          <input
            value={inputValue}
            onChange={handleInputChange}
            type="text"
            placeholder="Search for a neighbourhood or city..."
          />
          <Button
            onClick={() => {
              inputValue && router.push(`/guest?location=${inputValue}`);
            }}
          >
            <span>
              <FiSearch fontSize="1.1rem" />
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

      <div className={styles.howItWorks}>
        <div className={styles.head4}>
          <h1>
            How it <span style={{ color: "#f8cd46" }}>works</span>
          </h1>
        </div>
        <div className={styles.howImageContainer}>
          <div className={styles.arrowContainer}>
            <div>
              <Image src={img6} alt="" />
            </div>
            <div>
              <Image src={img7} alt="" />
            </div>
            <div>
              <Image src={img8} alt="" />
            </div>
            <div>
              <Image src={img9} alt="" />
            </div>
          </div>
          <div className={styles.howImageContainer1}>
            <div>
              <h4 style={{ textAlign: "left" }}>1. Create account</h4>
              <Image src={img1} alt="" />
              <p>
                Provide some details about yourself that a potential housemate
                would like to know. Creating a profile is completely free at
                HomeShare.
              </p>
            </div>
            <div>
              <h4>3. Connect</h4>
              <Image src={img3} alt="" />
              <p>{`Use HomeShare's inbox to get in touch with your potential housemate, ask questions you might have to determine whether you are compatible or not.`}</p>
            </div>
            <div>
              <h4>5. Move In</h4>
              <Image src={img5} alt="" />
              <p>
                Once you have found your perfect housemate, move in and start
                living together.
              </p>
            </div>
          </div>
          <div className={styles.howImageContainer2}>
            <div>
              <h4>2. Explore</h4>
              <Image src={img2} alt="" />
              <p>
                See the profiles of other people also looking for housemates,
                their interests, some of their personality traits & whether they
                have a home or not.
              </p>
            </div>
            <div>
              <h4>4. Meet Up</h4>
              <Image src={img4} alt="" />
              <p>
                To ensure the safety of everyone using HomeShare, all users are
                required to create a profile and verify their identities before
                being allowed to interact with other users.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.whoIsItFor}>
        <h1>
          Who <span style={{ color: "#f8cd46" }}>is it for</span>
        </h1>
        <div>
          <Image src={img10} alt="" />
        </div>
        <div>
          <Image src={img11} alt="" />
        </div>
      </div>

      <div className={styles.whatArePeople}>
        <h1>
          What makes us <span style={{ color: "#f8cd46" }}> unique</span>
        </h1>
        <div>
          <Image src={img12} alt="" />
          <h4>People centered</h4>
          <p>
            People are at the center of all we do. As our moto goes "its not
            what you live in; its you <strong>who</strong> live with."
          </p>
        </div>
        <div>
          <Image src={img13} alt="" />
          <h4>Safety first</h4>
          <p>
            All our users must identify their identities before being allowed to
            interact with other users.
          </p>
        </div>
      </div>

      <div className={styles.wps}>
        <h1>
          What are people <span style={{ color: "#f8cd46" }}> saying?</span>
        </h1>

        <div className={styles.aboutPeople}>
          <Slider {...settings}>
            {testimonial?.map((v, i) => {
              return (
                <div key={i} className={styles.sideCard}>
                  <hr />

                  <div className={styles.innerSidecard}>
                    <p className={`${styles.text}`}>{v.description}</p>
                    <div className={styles.inner}>
                      <img src={v.image} alt="" />
                      <div className={styles.innerText}>
                        <h4>{v.name}</h4>
                        <p>{v?.position}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </Slider>
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

export default connect(mapStateToProps, { getTestimonials, getCities })(
  LandingResponsive
);
