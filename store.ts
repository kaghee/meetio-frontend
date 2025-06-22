import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { appointmentApi } from "./src/services/appointment";
import { departmentApi } from "./src/services/department";

export const store = configureStore({
  reducer: {
    [appointmentApi.reducerPath]: appointmentApi.reducer,
    [departmentApi.reducerPath]: departmentApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(appointmentApi.middleware)
      .concat(departmentApi.middleware),
});

setupListeners(store.dispatch);
