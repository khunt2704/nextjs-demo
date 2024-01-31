import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ApiGet, ApiPost } from "../../Api/Api";

export const getPosts = createAsyncThunk("apiDemo/getPosts", async () => {
  return ApiPost("get-count", {}).then((res) => res);
});

export const apiDemoSlice = createSlice({
  name: "apiDemo",
  initialState: {
    lists: [],
    status: null,
  },
  extraReducers: {
    [getPosts.pending]: (state) => {
      state.status = "loading";
    },
    [getPosts.fulfilled]: (state, { payload }) => {
      state.lists = payload;
      state.status = "success";
    },
    [getPosts.rejected]: (state) => {
      state.status = "failed";
    },
  },
});

// Action creators are generated for each case reducer function
// export const {} = apiDemoSlice.actions;

export default apiDemoSlice.reducer;
