import { configureStore } from "@reduxjs/toolkit";
import apiDemoReducer from "./Redux/Apidemo/apiDemoSlice";
import maintananceDemoReducer from "./Redux/Apidemo/maintananceDemoSlice";
import counterReducer from "./Redux/login/authSlice";
import currencyReducer from "./Redux/Currency/Currency";

export const store = configureStore({
  reducer: {
    auth: counterReducer,
    apiDemo: apiDemoReducer,
    maintananceDemo: maintananceDemoReducer,
    currency: currencyReducer,
  },
});
