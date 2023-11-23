import React from "react";
import styles from "./pricing.module.css";
import { MdArrowBackIos } from "react-icons/md";
import { getContent } from "../../../redux/actions/contentAction";
import AppLoader from "@/utils/AppLoader/AppLoader";
import { connect } from "react-redux";
import Markdown from "markdown-to-jsx";
import { useRouter } from "next/router";

function Pricing(props) {
  const router = useRouter();

  React.useEffect(() => {
    props.getContent("PRICING");
  }, []);
  if (!props.content) {
    return (
      <div className={styles.noData}>
        <AppLoader />
      </div>
    );
  }
  if (props.content && props.content === "<p><br></p>") {
    return (
      <div className={styles.container}>
        <h4 className="fs-5 mt-5 mb-4">
          <span onClick={() => router.push("/")}>
            <MdArrowBackIos />{" "}
          </span>{" "}
          Pricing
        </h4>
        <div className={styles.noData}>There is No data to show</div>;
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h4 className="fs-5 mt-5 mb-4">
        <span onClick={() => router.push("/")}>
          <MdArrowBackIos />{" "}
        </span>{" "}
        Pricing
      </h4>

      {props.content && (
        <Markdown className={styles.content}>{props.content}</Markdown>
      )}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    content: state.content.privacy_pricing,
  };
};

export default connect(mapStateToProps, { getContent })(Pricing);
