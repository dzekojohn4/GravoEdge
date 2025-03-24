import { combineReducers } from "@reduxjs/toolkit";
import cryptoDashboardReducer from "./cryptoDashboard/cryptoDashboardSlice";

const rootReducer = combineReducers({
    cryptoDashboard: cryptoDashboardReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
