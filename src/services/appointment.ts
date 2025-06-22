import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  MeetingData,
  MeetingResponse,
} from "../components/meeting/Meeting";

interface GetAppointmentsQueryArgs {
  date: string;
}

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
    getAppointments: builder.query<MeetingResponse, GetAppointmentsQueryArgs>({
      query: ({ date }: GetAppointmentsQueryArgs) => {
        return `appointment/?date=${date}`;
      },
    }),
    updateAppointment: builder.mutation<MeetingData, Partial<MeetingData>>({
      query: (data) => {
        return {
          url: `appointment/${data.id}/`,
          method: "PATCH",
          body: data,
        };
      },
    }),
    deleteAppointment: builder.mutation<void, number>({
      query: (id) => {
        return {
          url: `appointment/${id}/`,
          method: "DELETE",
        };
      },
    }),
  }),
});

export const {
  useGetAppointmentsQuery,
  useUpdateAppointmentMutation,
  useDeleteAppointmentMutation,
} = appointmentApi;
