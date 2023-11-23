import * as actionTypes from "../types";

const content = (
  state = {
    privacy_pricing: false,
    testimonials: false,
    story: false,
    blogs: false,
    cities: false,
    usaCities: false,
    africaCities: false,
    ukCities: false,
    favorites: false,
    favoriteMeta: {
      totalData: 0,
      totalPage: 0,
      perPage: 0,
      currentPage: 0,
    },
    blogsMeta: {
      totalData: 0,
      totalPage: 0,
      perPage: 0,
      currentPage: 0,
    },
  },
  action
) => {
  switch (action.type) {
    case actionTypes.GET_PRIVACY_PRICING:
      return {
        ...state,
        privacy_pricing: action.payload,
      };
    case actionTypes.GET_TESTIMONIAL:
      return {
        ...state,
        testimonials: action.payload,
      };
    case actionTypes.SET_CITIES:
      return {
        ...state,
        cities: action.payload,
      };
    case actionTypes.GET_STORY:
      return {
        ...state,
        story: {
          text: action.payload.text,
          img: action.payload.img,
        },
      };
    // case actionTypes.SET_SOUTH_AFRICA:
    //   return {
    //     ...state,
    //     africaCities: action.payload,
    //   };
    // case actionTypes.SET_USA:
    //   return {
    //     ...state,
    //     usaCities: action.payload,
    //   };
    // case actionTypes.SET_UK:
    //   return {
    //     ...state,
    //     ukCities: action.payload,
    //   };
    case actionTypes.GET_BLOGS:
      return {
        ...state,
        blogs: action.payload.blogs,
        blogsMeta: {
          totalData: action.payload.totalData,
          totalPage: action.payload.totalPage,
          perPage: action.payload.perPage,
          currentPage: action.payload.currentPage,
        },
      };
    case actionTypes.GET_ALL_FAVORITES:
      return {
        ...state,
        favorites: action.payload.favorites,
        favoriteMeta: {
          totalData: action.payload.totalData,
          totalPage: action.payload.totalPage,
          perPage: action.payload.perPage,
          currentPage: action.payload.currentPage,
        },
      };

    default:
      return { ...state };
  }
};

export default content;
