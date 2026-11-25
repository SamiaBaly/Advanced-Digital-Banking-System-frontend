
import { configureStore } from "@reduxjs/toolkit";

import { baseApi } from "./api/baseApi";

import authReducer from "./slices/authSlice";
import accountReducer from "./slices/accountSlice";
import transactionReducer from "./slices/transactionSlice";
import loanReducer from "./slices/loanSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      account: accountReducer,
      transaction: transactionReducer,
      loan: loanReducer,
      [baseApi.reducerPath]: baseApi.reducer,
    },

    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(baseApi.middleware),
  });
};

export type AppStore = ReturnType<typeof makeStore>;

export type RootState = ReturnType<AppStore["getState"]>;

export type AppDispatch = AppStore["dispatch"];
