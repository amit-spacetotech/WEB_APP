import * as actionTypes from "../types";
import axios from "axios";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "../../config/config";

export const setSDSKd = (name) => (dispatch) => {
  dispatch({
    type: actionTypes.SET_AUTH,
    payload: name,
  });
};
export const setHouseMateFilter = (data) => (dispatch) => {
  dispatch({
    type: actionTypes.SET_HOUSE_MATES_FILTER,
    payload: data,
  });
};

export const getUser = () => (dispatch) => {
  dispatch({
    type: actionTypes.GET_USER,
    payload: false,
  });
  if (localStorage.getItem("token")) {
    axios({
      method: "get",
      url: "/user/getUser",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        dispatch({
          type: actionTypes.GET_USER,
          payload: res.data.user[0],
        });
        dispatch({
          type: actionTypes.SET_PROPERTY,
          payload: res.data.home,
        });
      })
      .catch((err) => {
        if (err.response && err.response.data && !err.response.data.status) {
          localStorage.clear();
          alert(
            "Your account has been deactivated by the Admin. Please contact the support"
          );
        }
        dispatch({
          type: actionTypes.GET_USER,
          payload: "NO_USER",
        });
      });
  } else {
    dispatch({
      type: actionTypes.GET_USER,
      payload: "NO_USER",
    });
  }
};

export const getHouseMates =
  (
    page,
    limit,
    search,
    _id,
    minRent,
    maxRent,
    minAge,
    maxAge,
    havePets,
    link
  ) =>
  (dispatch) => {
    dispatch({
      type: actionTypes.SET_HOUSE_MATES,
      payload: false,
    });
    const urlParams = new URLSearchParams(
      window.location && window.location.search
    );

    const location = urlParams.get("location");

    link = link ? link : "";
    axios({
      method: "get",
      url:
        `/utils/getAllMates?hideUserProfile=true&search=${search}&page=${page}&limit=${limit}&_id=${
          _id ? _id : ""
        }&minRent=${minRent ?? 0}&maxRent=${maxRent ?? 20000}&minAge=${
          minAge ?? 0
        }&maxAge=${maxAge ?? 30}&location=${
          location ? location : ""
        }&havePets=${
          havePets !== undefined && String(havePets) ? havePets : ""
        }` + link,
      basic: true,
      headers: {
        Authorization:
          "Basic SE9NRVNIQVJFOlJBTkRPTUhPTUVTSEFSRVBBU1NXT1JEUE9JVVlUUkVRV0VSVFlVSQ==",
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        dispatch({
          type: actionTypes.SET_HOUSE_MATES,
          payload: res.data,
        });
      })
      .catch((err) => {
        dispatch({
          type: actionTypes.SET_HOUSE_MATES,
          payload: false,
        });
      });
  };

export const getHomes =
  (
    page,
    limit,
    search,
    _id,
    bathRooms,
    bedRooms,
    isPetsAllowed,
    minRent,
    maxRent,
    minSize,
    maxSize,
    filter,
    allowPet
  ) =>
  (dispatch) => {
    !filter &&
      dispatch({
        type: actionTypes.SET_HOMES,
        payload: false,
      });

    const urlParams = new URLSearchParams(
      window.location && window.location.search
    );
    const location = urlParams.get("location");
    axios({
      method: "get",
      url: `/home/getAllHomes?search=${search ?? ""}&page=${page}&limit=${
        filter ? 1 : limit
      }&_id=${_id ? _id : ""}&bathRooms=${bathRooms ?? ""}&bedRooms=${
        bedRooms ?? ""
      }&isPetsAllowed=${allowPet ? isPetsAllowed : ""}&minRent=${
        minRent ?? ""
      }&maxRent=${maxRent ?? ""}&location=${location ? location : ""}&minSize=${
        minSize ?? ""
      }&maxSize=${maxSize ?? ""}`,
      basic: true,
      headers: {
        Authorization:
          "Basic SE9NRVNIQVJFOlJBTkRPTUhPTUVTSEFSRVBBU1NXT1JEUE9JVVlUUkVRV0VSVFlVSQ==",
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        {
          !filter &&
            dispatch({
              type: actionTypes.SET_HOMES,
              payload: res.data,
            });
        }

        filter &&
          dispatch({
            type: actionTypes.SET_HOMES_FILTER,
            payload: res.data.totalCount,
          });
      })
      .catch((err) => {
        dispatch({
          type: actionTypes.SET_HOMES,
          payload: [],
        });
      });
  };

export const getFavorites = (type) => (dispatch) => {
  dispatch({
    type: actionTypes.GET_FAVORITES_LIST,
    payload: false,
  });

  axios({
    method: "get",
    url: `/favorites/getAllFavorites?userProfile=${
      type === "userProfile" ? "userProfile" : ""
    }&home=${type === "home" ? "home" : ""}`,
  })
    .then((res) => {
      dispatch({
        type: actionTypes.GET_FAVORITES_LIST,
        payload: res.data.favorites,
      });
    })
    .catch((err) => {
      dispatch({
        type: actionTypes.GET_FAVORITES_LIST,
        payload: false,
      });
    });
};

export const getFilteredHouseMates = (link) => (dispatch) => {
  const urlParams = new URLSearchParams(
    window.location && window.location.search
  );
  const location = urlParams.get("location");
  axios({
    method: "get",
    url: `${link}&location=${location ? location : ""}`,
    basic: true,
    headers: {
      Authorization:
        "Basic SE9NRVNIQVJFOlJBTkRPTUhPTUVTSEFSRVBBU1NXT1JEUE9JVVlUUkVRV0VSVFlVSQ==",
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      dispatch({
        type: actionTypes.SET_HOUSE_MATES_FILTER,
        payload: res.data.totalCount,
      });
    })
    .catch((err) => {
      dispatch({
        type: actionTypes.SET_HOUSE_MATES_FILTER,
        payload: 0,
      });
    });
};

export const getMoveIn = (ownerId, intiatedBy) => (dispatch) => {
  dispatch({
    type: actionTypes.GET_MOVE_IN,
    payload: false,
  });
  axios({
    method: "get",
    url: `/moveIn/getMoveIn?ownerId=${ownerId}&intiatedBy=${intiatedBy}`,
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      dispatch({
        type: actionTypes.GET_MOVE_IN,
        payload: res.data.getMoveIn,
      });
    })
    .catch((err) => {
      dispatch({
        type: actionTypes.GET_MOVE_IN,
        payload: "NO_DATA",
      });
    });
};

export const getTotalMessageCount = (_id) => (dispatch) => {
  if (_id) {
    const userInfoCollectionRef = collection(
      db,
      "userchatlist",
      _id,
      "userInfo"
    );

    const unsubscribe = onSnapshot(userInfoCollectionRef, (querySnapshot) => {
      const userInfoData = [];
      querySnapshot.forEach((doc) => {
        userInfoData.push(doc.data());
      });

      const totalCount = userInfoData.reduce(
        (count, obj) => count + obj.msgCount,
        0
      );
      console.log(totalCount);

      dispatch({
        type: actionTypes.SET_MESSAGES_COUNT,
        payload: totalCount,
      });
    });

    // Return the unsubscribe function to stop listening for updates
    return unsubscribe;
  }
};

export const getSingleUser = () => (dispatch) => {
  dispatch({
    type: actionTypes.GET_USER,
    payload: false,
  });

  axios({
    method: "get",
    url: "/user/getUser",
    headers: {
      Authorization:
        "Basic SE9NRVNIQVJFOlJBTkRPTUhPTUVTSEFSRVBBU1NXT1JEUE9JVVlUUkVRV0VSVFlVSQ==",
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      dispatch({
        type: actionTypes.GET_USER,
        payload: res.data.user[0],
      });
      dispatch({
        type: actionTypes.SET_PROPERTY,
        payload: res.data.home,
      });
    })
    .catch((err) => {
      dispatch({
        type: actionTypes.GET_USER,
        payload: "NO_USER",
      });
    });
};

export const checkStatus = () => (dispatch) => {
  if (localStorage.getItem("token")) {
    axios({
      method: "get",
      url: "/user/getUser",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        let data = res.data.user[0];
        if (!data.status) {
          localStorage.clear();
          alert(
            "Your account has been deactivated by the Admin. Please contact the support"
          );
        }
      })
      .catch((err) => {});
  } else {
    dispatch({
      type: actionTypes.GET_USER,
      payload: "NO_USER",
    });
  }
};
