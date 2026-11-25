
"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Provider } from "react-redux";

import { makeStore, type AppStore } from "./store";
import { useAppDispatch } from "./hooks";
import { setCredentials } from "./slices/authSlice";
import { getToken, getUser } from "@/lib/auth";

interface ReduxProviderProps {
  children: ReactNode;
}

function AuthRestorer({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = getToken();
    const user = getUser();

    if (
      token &&
      user &&
      user.userStatus !== "blocked" &&
      user.userStatus !== "inactive" &&
      (user.id || user._id)
    ) {
      dispatch(
        setCredentials({
          id: user.id || user._id || "",
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          userStatus: user.userStatus || "active",
        })
      );
    }
  }, [dispatch]);

  return <>{children}</>;
}

export default function ReduxProvider({
  children,
}: ReduxProviderProps) {
  const [store] = useState<AppStore>(() => makeStore());

  return (
    <Provider store={store}>
      <AuthRestorer>{children}</AuthRestorer>
    </Provider>
  );
}
