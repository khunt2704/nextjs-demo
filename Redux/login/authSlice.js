import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: 0,
  userData: { name: "" },
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
    loginData: (state, { payload }) => {
      if (
        payload?.email === "user@gmail.com" &&
        payload?.password === "password"
      ) {
        localStorage.setItem("userinfo", JSON.stringify(payload));
        state.userData = payload;
      } else {
        alert("user is not found");
      }
    },
    logout: (state, { payload }) => {
      state.userData = { name: "" };
    },
  },
});

// Action creators are generated for each case reducer function
export const { increment, decrement, incrementByAmount, loginData, logout } =
  authSlice.actions;

export default authSlice.reducer;
