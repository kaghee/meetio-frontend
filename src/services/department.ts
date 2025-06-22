import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { DepartmentResponse, Employee } from "../types";

const getToken = () => {
  return localStorage.getItem("authToken");
};

export const departmentApi = createApi({
  reducerPath: "departmentApi",
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
    getDepartments: builder.query<DepartmentResponse[], object>({
      query: () => {
        return "department/";
      },
    }),
    getEmployeesById: builder.query<Partial<Employee>[], number>({
      query: (id) => {
        return `department/${id}/employees/`;
      },
    }),
  }),
});

export const { useGetDepartmentsQuery, useGetEmployeesByIdQuery } =
  departmentApi;
