"use client";

import { ToastContainer } from "react-toastify";

export function AppToaster() {
  return (
    <ToastContainer
      position="top-right"
      autoClose={2800}
      hideProgressBar
      newestOnTop
      closeOnClick
      pauseOnFocusLoss={false}
      pauseOnHover
      theme="light"
      toastClassName="rounded-md border border-slate-200 text-sm shadow-lg"
    />
  );
}
