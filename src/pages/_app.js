import Layout from "@/layout";
import { wrapper, store } from "../redux/store";
import { Provider } from "react-redux";
import "@/styles/globals.css";
import axios from "axios";
import { backendUrl } from "../config/config";
import { getUser, checkStatus } from "@/redux/actions/auth";
import { connect } from "react-redux";
import React from "react";
import { useRouter } from "next/router";

axios.interceptors.request.use(async (config) => {
  config.url = config.externalUrl ? config.url : backendUrl + config.url;

  if (localStorage.token && !config.externalUrl && !config.basic) {
    config.headers = {
      ...config.headers,
      Authorization: localStorage.getItem("token"),
    };
  }
  return config;
});

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const { status } = error && error.response;

    if (status === 401) {
      // localStorage.removeItem("token");
      // window.location.replace("/login");
    }
    return Promise.reject(error);
  }
);

function App({ Component, pageProps, ...props }) {
  const router = useRouter();
  const routerPath = ["/aboutus", "/blog", "/privacy", "/pricing", "/contact"];
  React.useEffect(() => {
    if (
      !localStorage.getItem("token") &&
      !routerPath.includes(router.pathname)
    ) {
      router.push("/");
    }
    if (!props.auth.user || localStorage.getItem("token")) {
      props.getUser();
    }
    const handleRouteChange = (url) => {
      props.checkStatus();
    };

    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, []);

  React.useEffect(() => {}, []);
  return (
    <Layout>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </Layout>
  );
}
const mapStateToProps = (state) => ({
  auth: state.auth,
});
export default wrapper.withRedux(
  connect(mapStateToProps, { getUser, checkStatus })(App)
);
