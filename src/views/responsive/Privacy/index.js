import React from "react";
import styles from "./privacy.module.css";
import { connect } from "react-redux";
import { getContent } from "../../../redux/actions/contentAction";
import AppLoader from "@/utils/AppLoader/AppLoader";
import Markdown from "markdown-to-jsx";

function PrivacyRes(props) {
  React.useEffect(() => {
    props.getContent("PRIVACY");
  }, []);

  if (!props.content) {
    return <AppLoader />;
  }
  if (!props.content || props.content === "<p><br></p>") {
    return <div className={styles.noData}>There is No data to show</div>;
  }
  return (
    <div className={styles.container}>
      <h1>
        <span style={{ color: "#f8cd46" }}>Privacy </span>& Terms
      </h1>

      <Markdown className={styles.content}>{props.content}</Markdown>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    content: state.content.privacy_pricing,
  };
};

export default connect(mapStateToProps, { getContent })(PrivacyRes);
