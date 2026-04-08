import { configureStore } from "@reduxjs/toolkit";
import customerReducer from "../features/customers/customerSlice";

export const store = configureStore({
  reducer: {
    customers: customerReducer,
  },
});