import { configureStore } from "@reduxjs/toolkit";
import customers from "./customerSlice";

export const store = configureStore({
  reducer: { customers },
});