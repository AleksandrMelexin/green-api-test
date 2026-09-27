import React from "react";
import ReactDOM from "react-dom/client";
import Router from "./router";
import "antd/dist/reset.css";
import { AntdConfigProvider } from "./antd.config";

export const start = () => {
  const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
  );
  root.render(
    <React.StrictMode>
      <AntdConfigProvider>
        <Router />
      </AntdConfigProvider>
    </React.StrictMode>
  );
};