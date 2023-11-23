import React from "react";
import Markdown from "markdown-to-jsx";
import styles from "./privacy.module.css";
import { MdArrowBackIos } from "react-icons/md";
import { getContent } from "../../../redux/actions/contentAction";
import AppLoader from "@/utils/AppLoader/AppLoader";
import { connect } from "react-redux";
import { useRouter } from "next/router";

function Privacy(props) {
  const router = useRouter();

  React.useEffect(() => {
    props.getContent("PRIVACY");
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
          Privacy & Terms
        </h4>
        <div className={styles.noData}>There is No data to show</div>;
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h4 className="fs-5 mt-5 mb-4">
        <span onClick={() => router.push("/")}>
          <MdArrowBackIos />
        </span>
        Privacy & Terms
      </h4>

      {props.content && (
        <div className={styles.content}>
          <Markdown>{props.content}</Markdown>
        </div>
      )}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    content: state.content.privacy_pricing,
  };
};

export default connect(mapStateToProps, { getContent })(Privacy);
