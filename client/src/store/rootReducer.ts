import { combineReducers } from "redux";
import storage from "redux-persist/lib/storage";

import authReducer from "./slices/auth";
import appReducer from "./slices/app";

import vibyApi from "./api/viby";

const rootPersistConfig = {
  key: "root",
  storage,
  keyPrefix: "redux-",
  blacklist: ["app"],
  whitelist: ["auth"],
};

const rootReducer = combineReducers({
  auth: authReducer,
  app: appReducer,
  [vibyApi.reducerPath]: vibyApi.reducer,
});

export { rootReducer, rootPersistConfig };
