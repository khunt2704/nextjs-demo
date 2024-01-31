import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ApiGet } from "../../Api/Api";

export const getMaintenance = createAsyncThunk("maintananceDemo/getMaintenance", async () => {
    return ApiGet("maintenance", {}).then((res) => res);
  });
  

export const maintananceDemoSlice = createSlice({
  name: "maintananceDemo",
  initialState: {
    maintenance: [],
    status: null,
  },
  extraReducers: {
    [getMaintenance.pending]: (state) => {
      state.status = "loading";
    },
    [getMaintenance.fulfilled]: (state, { payload }) => {
      state.maintenance = payload;
      state.status = "success";
    },
    [getMaintenance.rejected]: (state) => {
      state.status = "failed";
    },
  },
});

// Action creators are generated for each case reducer function
// export const {} = maintananceSlice.actions;

export default maintananceDemoSlice.reducer;
