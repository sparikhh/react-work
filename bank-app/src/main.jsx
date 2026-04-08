import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Statements from "./Statements";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/statements" element={<Statements />} />
    </Routes>
  </BrowserRouter>
);