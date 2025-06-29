"use server";

import axios from "axios";
import { auth } from "@clerk/nextjs/server";

export const api = axios.create({
  baseURL: process.env.SERVER_URL || "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export const apiCall = async <T>(url: string, method: string, body?: Record<string, any>, headers?: Record<string, any>): Promise<T> => {
  console.log("apiCall", url, method, body, headers);
  try {
    const { getToken } = await auth();
    const token = await getToken();

    const response = await api.request({
      url: url,
      method: method,
      data: body,
      headers: {
        ...headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    return response.data as T;
  } catch (error) {
    throw error;
  }
};
