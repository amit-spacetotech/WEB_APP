import { combineReducers } from "redux";
import auth from "./auth";
import content from "./contentReducer";

const rootReducer = combineReducers({
  auth: auth,
  content: content,
});

export default rootReducer;
