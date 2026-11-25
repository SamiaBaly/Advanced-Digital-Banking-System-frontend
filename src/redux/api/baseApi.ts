
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getToken } from "@/lib/auth";

export const baseApi = createApi({
  reducerPath: "api",

  baseQuery: fetchBaseQuery({
    baseUrl:
      process.env.NEXT_PUBLIC_API_URL ||
      "http://localhost:5002/api",

    credentials: "include",

    prepareHeaders: (headers) => {
      const token = getToken();

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),

  tagTypes: [
    "Auth",
    "Account",
    "Transaction",
    "BankingRequest",
    "Loan",
    "Notification",
    "BankSettings",
    "Dashboard",
    "Card",
    "Staff",
    "Report",
  ],

  endpoints: () => ({}),
});
