"use client";

import { Provider } from "react-redux";
import { useRef, useEffect } from "react";
import { makeStore } from "@/lib/redux/store";
import { setCredentials } from "@/lib/redux/slices/authSlice";

export default function Providers({ children }: { children: React.ReactNode }) {
  const storeRef = useRef(makeStore());
  const store = storeRef.current;

  // Khôi phục token/user từ localStorage (đơn giản, nhanh)
  useEffect(() => {
    try {
      const raw = localStorage.getItem("auth");
      if (raw) {
        const parsed = JSON.parse(raw);
        store.dispatch(setCredentials(parsed));
      }
    } catch {}
  }, [store]);

  return <Provider store={store}>{children}</Provider>;
}
