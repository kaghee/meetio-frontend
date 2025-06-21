import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { MeetingResponse } from "../components/meeting/Meeting";

const getToken = () => {
  return localStorage.getItem("authToken");
};

export const appointmentApi = createApi({
  reducerPath: "appointmentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/",
    prepareHeaders: (headers) => {
      const token = getToken();
      if (token) {
        headers.set("Authorization", `Token ${token}`);
      } else {
        console.warn("No authentication token found in localStorage.");
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getAppointments: builder.query<MeetingResponse, { date: string }>({
      query: ({ date }: { date: string }) => {
        return `appointment/?date=${date}`;
      },
    }),
  }),
});

export const { useGetAppointmentsQuery } = appointmentApi;
