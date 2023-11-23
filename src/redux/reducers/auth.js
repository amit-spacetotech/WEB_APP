import * as actionTypes from "../types";

const auth = (
  state = {
    name: "guest",
    user: false,
    messageCount: false,
    userProperty: false,
    homes: false,
    userFavorites: false,
    moveIn: false,
    homesMetaData: {
      perPage: 0,
      totalPage: 0,
      totalCount: 0,
    },
    houseMates: false,
    houseMatesMeta: {
      perPage: 0,
      totalPage: 0,
      totalCount: 0,
    },
    filteredHouseMateCount: 0,
    filteredHomesCount: 0,
  },
  action
) => {
  switch (action.type) {
    case actionTypes.SET_AUTH:
      return {
        ...state,
        name: action.payload,
      };
    case actionTypes.GET_USER:
      return {
        ...state,
        user: action.payload,
      };
    case actionTypes.SET_MESSAGES_COUNT:
      return {
        ...state,
        messageCount: action.payload,
      };
    case actionTypes.SET_PROPERTY:
      return {
        ...state,
        userProperty: action.payload,
      };
    case actionTypes.GET_MOVE_IN:
      return {
        ...state,
        moveIn: action.payload,
      };
    case actionTypes.SET_HOUSE_MATES_FILTER:
      return {
        ...state,
        filteredHouseMateCount: action.payload,
      };
    case actionTypes.SET_HOMES_FILTER:
      return {
        ...state,
        filteredHomesCount: action.payload,
      };
    case actionTypes.GET_FAVORITES_LIST:
      return {
        ...state,
        userFavorites: action.payload,
      };
    case actionTypes.SET_HOUSE_MATES:
      return {
        ...state,
        houseMates: action.payload.houseMates,
        houseMatesMeta: {
          perPage: action.payload.perPage,
          totalPage: action.payload.totalPage,
          totalCount: action.payload.totalCount,
        },
      };
    case actionTypes.SET_HOMES:
      return {
        ...state,
        homes: action.payload.homeDetails,
        homesMetaData: {
          perPage: action.payload.perPage,
          totalPage: action.payload.totalPage,
          totalCount: action.payload.totalCount,
        },
      };
    default:
      return { ...state };
  }
};

export default auth;
