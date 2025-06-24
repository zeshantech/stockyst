import axios from "axios";
import { auth0 } from "./auth0";

export const api = axios.create({
  baseURL: process.env.SERVER_URL || "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  (async () => {
    const token = {
      token:
        "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImVUNmxRcG9XVEw3djJWQU5UQ2EtbSJ9.eyJpc3MiOiJodHRwczovL2Rldi1xYzZrbTN1M3V3Nm5oZDRiLnVzLmF1dGgwLmNvbS8iLCJzdWIiOiJhdXRoMHw2ODU2OGFiNjRiMmUzOWQwYzkwZjAwZDciLCJhdWQiOlsiaHR0cHM6Ly9zdG9ja3lzdC52ZXJjZWwuYXBwIiwiaHR0cHM6Ly9kZXYtcWM2a20zdTN1dzZuaGQ0Yi51cy5hdXRoMC5jb20vdXNlcmluZm8iXSwiaWF0IjoxNzUwNzE1ODc0LCJleHAiOjE3NTA4MDIyNzQsInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwiLCJhenAiOiJHR1lQR1BMQmRCSW1OUlhURkhDRlVMOXlPMW5sV1pKVyJ9.BCMChfoxhOhK3FTVIs8TncLVLjrr1rDdin8FnumQf838SlTvgGU05HGWX67Y8GmpQ8B5qLLhsllT014eebOdYNhe_LTl1RpTObzExs8KMryaX4DAISUwfHDdWt3VeISc-9hMHoz34ifU4KgA4AFWnV6jv0IKRpI2-sreZvmJfmlHnfNRNKrxg_TorkpiE5j_ySe2weydPfuh1swLpjhBLkKt5SjFkdZxoxIAdMUK2BVbtGmXvR0u0V4u1O6PDGKzEiMRtc2HxGvY-q6c6cqo_cxC9VsxtbrtpgW9gYvkeSzx2hXLu361SKBa6UU_6H5UFeCNVOpHnjP-yz32NLiVig",
    };
    if (token) {
      config.headers.Authorization = `Bearer ${token.token}`;
    }
  })();

  return config;
});

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("=======================================", error, "=======================================");
    return Promise.reject(error);
  }
);
