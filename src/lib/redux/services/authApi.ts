import { baseApi } from "./baseApi";
import { setCredentials, logout } from "../slices/authSlice";

export interface LoginDto {
  email: string;
  password: string;
}
export interface User {
  id: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
}
export interface LoginResponse {
  accessToken: string;
  user: User;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginDto>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // Lưu vào Redux
          dispatch(setCredentials(data));
          // Lưu vào localStorage để tự đăng nhập lại
          localStorage.setItem("auth", JSON.stringify(data));
        } catch {}
      },
    }),

    getMe: builder.query<User, void>({
      query: () => ({ url: "/auth/me", method: "GET" }),
      providesTags: ["Me"],
    }),

    // (tuỳ chọn) refresh token nếu backend có
    refresh: builder.mutation<LoginResponse, void>({
      query: () => ({ url: "/auth/refresh", method: "POST" }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(data));
          localStorage.setItem("auth", JSON.stringify(data));
        } catch {
          dispatch(logout());
          localStorage.removeItem("auth");
        }
      },
    }),
  }),
  overrideExisting: false,
});

export const { useLoginMutation, useGetMeQuery, useRefreshMutation } = authApi;
