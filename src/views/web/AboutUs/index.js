import Image from "next/image";
import React from "react";
import NewImg from "../../../assets/check.png";
import styles from "./about.module.css";
import { connect } from "react-redux";
import { getStory } from "@/redux/actions/contentAction";
import AppLoader from "@/utils/AppLoader/AppLoader";
import Markdown from "markdown-to-jsx";
function AboutUs(props) {
  React.useEffect(() => {
    if (!props.story) {
      props.getStory();
    }
  }, [props.story]);

  return (
    <div className={styles.container}>
      {!props.story && <AppLoader />}
      {props.story && (
        <>
          <h4 className={styles.head1}>
            About <span>us</span>
          </h4>
          <div className={styles.head2}>
            <span />
            <p
              className="mb-0 px-2 fw-bold"
              style={{ fontFamily: "Quicksand" }}
            >
              Our Story
            </p>
            <span />
          </div>
          <div className={styles.content}>
            <img src={props.story.img} className={styles.image} />
            {props.story && props.story.text && (
              <Markdown>{props.story.text}</Markdown>
            )}
          </div>
        </>
      )}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    story: state.content.story,
  };
};

export default connect(mapStateToProps, { getStory })(AboutUs);
