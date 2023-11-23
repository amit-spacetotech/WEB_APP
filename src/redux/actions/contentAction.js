import * as actionTypes from "../types";
import axios from "axios";

export const getContent = (type) => (dispatch) => {
  dispatch({
    type: actionTypes.GET_PRIVACY_PRICING,
    payload: false,
  });

  axios({
    method: "get",
    url: `/content/getConfidential?type=${type}`,
    headers: {
      Authorization:
        "Basic SE9NRVNIQVJFOlJBTkRPTUhPTUVTSEFSRVBBU1NXT1JEUE9JVVlUUkVRV0VSVFlVSQ==",
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      dispatch({
        type: actionTypes.GET_PRIVACY_PRICING,
        payload: res.data.term.text,
      });
    })
    .catch((err) => {
      dispatch({
        type: actionTypes.GET_PRIVACY_PRICING,
        payload: "No Data Found",
      });
    });
};

export const getTestimonials = (type) => (dispatch) => {
  dispatch({
    type: actionTypes.GET_TESTIMONIAL,
    payload: false,
  });

  axios({
    method: "get",
    url: `/content/getTestimonial?page=1&limit=10`,
    headers: {
      Authorization:
        "Basic SE9NRVNIQVJFOlJBTkRPTUhPTUVTSEFSRVBBU1NXT1JEUE9JVVlUUkVRV0VSVFlVSQ==",
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      dispatch({
        type: actionTypes.GET_TESTIMONIAL,
        payload: res.data.testimonial,
      });
    })
    .catch((err) => {});
};

export const getBlogs = (page, limit, search) => (dispatch) => {
  dispatch({
    type: actionTypes.GET_BLOGS,
    payload: false,
  });

  axios({
    method: "get",
    basic: true,
    url: `/content/getBlogs?page=${page}&limit=${limit}&search=${search}`,
    headers: {
      Authorization:
        "Basic SE9NRVNIQVJFOlJBTkRPTUhPTUVTSEFSRVBBU1NXT1JEUE9JVVlUUkVRV0VSVFlVSQ==",
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      dispatch({
        type: actionTypes.GET_BLOGS,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: actionTypes.GET_BLOGS,
        payload: [],
      });
    });
};

export const getFavoritesList = (page, limit) => (dispatch) => {
  dispatch({
    type: actionTypes.GET_ALL_FAVORITES,
    payload: false,
  });

  axios({
    method: "get",
    url: `/favorites/getFavorites?page=${page}&limit=${limit}`,
  })
    .then((res) => {
      dispatch({
        type: actionTypes.GET_ALL_FAVORITES,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: actionTypes.GET_ALL_FAVORITES,
        payload: [],
      });
    });
};

const CityObj = {
  Russia: true,
  Germany: true,
  "United Kingdom": true,
  France: true,
  Italy: true,
  Spain: true,
  Ukraine: true,
  Poland: true,
  Romania: true,
  Netherlands: true,
  Belgium: true,
  "Czech Republic": true,
  Greece: true,
  Portugal: true,
  Sweden: true,
  Hungary: true,
  Belarus: true,
  Austria: true,
  Serbia: true,
  Switzerland: true,
  Bulgaria: true,
  Denmark: true,
  Finland: true,
  Slovakia: true,
  Norway: true,
  Ireland: true,
  Croatia: true,
  Moldova: true,
  "Bosnia and Herzegovina": true,
  Albania: true,
  Lithuania: true,
  Macedonia: true,
  Slovenia: true,
  Latvia: true,
  Estonia: true,
  Montenegro: true,
  Luxembourg: true,
  Malta: true,
  Iceland: true,
  Andorra: true,
  Monaco: true,
  Liechtenstein: true,
  "San Marino": true,
  "South Africa": true,
  "United States": true,
};
export const getCities = () => (dispatch) => {
  axios({
    maxBodyLength: Infinity,
    url: "https://countriesnow.space/api/v0.1/countries",
    headers: {},
    externalUrl: true,
  })
    .then((res) => {
      let data = { ...res.data.data };
      let allCities = [];
      Object.values(data).forEach((item) => {
        if (item.country === "South Africa") {
          item.cities.join(",");
          allCities.push(...item.cities);
        }
      });
      const uniqueCities = [...new Set(allCities)];
      dispatch({
        type: actionTypes.SET_CITIES,
        payload: uniqueCities,
      });
    })

    .catch((err) => {
      dispatch({
        type: actionTypes.SET_CITIES,
        payload: [],
      });
    });
};

export const getStory = (type) => (dispatch) => {
  dispatch({
    type: actionTypes.GET_STORY,
    payload: false,
  });

  axios({
    method: "get",
    url: `/content/getConfidential?type=STORY`,
    headers: {
      Authorization:
        "Basic SE9NRVNIQVJFOlJBTkRPTUhPTUVTSEFSRVBBU1NXT1JEUE9JVVlUUkVRV0VSVFlVSQ==",
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      dispatch({
        type: actionTypes.GET_STORY,
        payload: res.data.term,
      });
    })
    .catch((err) => {});
};


