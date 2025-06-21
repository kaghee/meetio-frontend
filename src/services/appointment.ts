import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const getToken = () => {
  return localStorage.getItem("authToken");
};

export const appointmentApi = createApi({
  reducerPath: "appointmentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/",
    prepareHeaders: (headers) => {
      const token = getToken();
      // console.log("!!!!token", token);

      if (token) {
        // Assuming Django REST Framework TokenAuthentication expects "Token <your_token>"
        headers.set("Authorization", `Token ${token}`);
      } else {
        console.warn("No authentication token found in localStorage.");
      }

      // Return the headers so they are applied to the request
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getAppointments: builder.query({
      query: (date: string) => {
        return date ? `appointment/?date=${date}` : "appointment/";
      },
    }),
  }),
});

export const { useGetAppointmentsQuery } = appointmentApi;
