import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import styles from "./single.module.css";
import axios from "axios";
import AppLoader from "@/utils/AppLoader/AppLoader";
import Markdown from "markdown-to-jsx";
const id = () => {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const date = new Date(data.updatedAt);
  const formattedDate = date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  useEffect(() => {
    if (router.query.id) {
      setLoading(true);
      axios({
        method: "get",
        url: `/content/getBlog?_id=${router.query.id}`,
        headers: {
          Authorization:
            "Basic SE9NRVNIQVJFOlJBTkRPTUhPTUVTSEFSRVBBU1NXT1JEUE9JVVlUUkVRV0VSVFlVSQ==",
          "Content-Type": "application/json",
        },
      }).then((res) => {
        setData(res.data.blog);
        setLoading(false);
      });
    }
  }, [router.query.id]);
  if (loading) {
    return <AppLoader />;
  }

  return (
    <div className={styles.container}>
      <h4 className={styles.head}>
        HomeShare <span>blog</span>
      </h4>

      <div className={styles.content}>
        <div className={styles.leftContent}>
          <p className={styles.title}>{data.name}</p>
          <p className={styles.data}>{formattedDate}</p>
          <Markdown className={styles.description}>
            {data.description ? data.description : ""}
          </Markdown>
        </div>
        <div className={styles.rightContent}>
          <img src={data.image} className={styles.image} />
        </div>
      </div>
    </div>
  );
};

export default id;
