import React, { StrictMode } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import "./app.css";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import store from "./store/reduxStore.js";
import "react-inner-image-zoom/lib/styles.min.css";
import AppErrorBoundary from "./components/AppErrorBoundary.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <AppErrorBoundary>
          <App />
        </AppErrorBoundary>
      </Provider>
    </BrowserRouter>
  </StrictMode>
);
