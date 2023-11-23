
import React from "react";
import styles from "./blog.module.css";

function Card(props) {
  const date = new Date(props.data.updatedAt);
  const formattedDate = date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  return (
    <div className={styles.cards}>
      <img src={props.data?.image} className={styles.thumbnail} alt="Blog" />
      <p className={styles.title}>{props.data?.name}</p>
      <p className={styles.date}>{formattedDate}</p>
    </div>
  );
}

export default Card;
