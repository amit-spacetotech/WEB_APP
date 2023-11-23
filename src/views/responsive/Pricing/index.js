import React from "react";
import styles from "./pricing.module.css";
import { connect } from "react-redux";
import { getContent } from "../../../redux/actions/contentAction";
import Markdown from "markdown-to-jsx";
import AppLoader from "@/utils/AppLoader/AppLoader";

function PricingRes(props) {
  React.useEffect(() => {
    props.getContent("PRICING");
  }, []);

  if (!props.content) {
    return <AppLoader />;
  }
  if (props.content === "<p><br></p>") {
    return <div className={styles.noData}>There is No data to show</div>;
  }

  return (
    <div className={styles.container}>
      <h1>
        Our<span style={{ color: "#f8cd46", marginLeft: "5px" }}>Pricing</span>
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
export default connect(mapStateToProps, { getContent })(PricingRes);
