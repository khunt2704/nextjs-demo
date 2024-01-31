import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ApiGet } from "../../Api/Api";

export const getIp = createAsyncThunk("apiDemo/getIp", async () => {
  return ApiGet("get-ip").then((res) => res);
});

export const currencySlice = createSlice({
  name: "currency",
  initialState: {
    currency: "₹",
    ip: "",
    calling_code: "IN",
  },
  extraReducers: {
    [getIp.pending]: (state) => {
      state.status = "loading";
    },
    [getIp.fulfilled]: (state, { payload }) => {
      state.ip = payload;
      // state.currency = payload?.data?.result?.country_name === "India" ? "₹" : "$"
      // state.calling_code = payload?.data?.result?.country_code
      state.status = "success";
    },
    [getIp.rejected]: (state) => {
      state.status = "failed";
    },
  },
});

// Action creators are generated for each case reducer function
// export const {} = currencySlice.actions;

export default currencySlice.reducer;
