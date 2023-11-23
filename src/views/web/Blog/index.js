import React from "react";
import Card from "./card";
import styles from "./blog.module.css";
import { getBlogs } from "../../../redux/actions/contentAction";
import { connect } from "react-redux";
import AppLoader from "@/utils/AppLoader/AppLoader";
import { useRouter } from "next/router";

function Blog(props) {
  const router = useRouter();

  const [meta, setMeta] = React.useState({
    page: 1,
    limit: 6,
  });

  React.useEffect(() => {
    if (!props.blogs) {
      props.getBlogs(meta.page, meta.limit, "");
    }
  }, [props.blogs]);
  const handleLoadMore = () => {
    setMeta({ ...meta, limit: meta.limit + 6 });
    props.getBlogs(meta.page, meta.limit + 6, "");
  };
  return (
    <div className={styles.container}>
      <h4 className={styles.head1}>
        HomeShare <span>blog</span>{" "}
      </h4>
      {!props.blogs && <AppLoader />}
      <div className={styles.content}>
        {props.blogs &&
          props.blogs?.map((v, i) => {
            return (
              <div
                onClick={() =>
                  router.push({
                    pathname: `/blog/${v._id}`,
                  })
                }
              >
                <Card key={i} data={v} />
              </div>
            );
          })}
      </div>

      <div>
        {props.blogsMeta &&
          props.blogsMeta.totalData > 0 &&
          props.blogsMeta.totalData > props.blogsMeta.perPage && (
            <h5 onClick={() => handleLoadMore()}>Load more</h5>
          )}
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    blogs: state.content.blogs,
    blogsMeta: state.content.blogsMeta,
  };
};

export default connect(mapStateToProps, { getBlogs })(Blog);
