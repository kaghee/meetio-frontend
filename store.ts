import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { appointmentApi } from "./src/services/appointment";

export const store = configureStore({
  reducer: {
    [appointmentApi.reducerPath]: appointmentApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(appointmentApi.middleware),
});

setupListeners(store.dispatch);
