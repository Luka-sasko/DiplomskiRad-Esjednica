import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import IndexRoutes from "./pages/IndexRoutes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <IndexRoutes />
    <ToastContainer
      position="bottom-right"
      autoClose={3000}
      newestOnTop
      pauseOnFocusLoss={false}
      pauseOnHover={true}
      limit={3}
      style={{ zIndex: 10000 }}
      theme="colored"
    />{" "}
  </React.StrictMode>
);
