import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./../redux/services/baseApi";
import { authApi } from "./../redux/services/authApi";
import authReducer from "./slices/authSlice";

export const makeStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
      [authApi.reducerPath]: authApi.reducer,
      [baseApi.reducerPath]: baseApi.reducer,
    },
    middleware: (getDefault) =>
      getDefault().concat(baseApi.middleware, authApi.middleware),
    devTools: process.env.NODE_ENV !== "production",
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
