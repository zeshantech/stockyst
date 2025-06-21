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
    const token = {token: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImVUNmxRcG9XVEw3djJWQU5UQ2EtbSJ9.eyJpc3MiOiJodHRwczovL2Rldi1xYzZrbTN1M3V3Nm5oZDRiLnVzLmF1dGgwLmNvbS8iLCJzdWIiOiJnaXRodWJ8MTM4NjYwNDc0IiwiYXVkIjpbImh0dHBzOi8vc3RvY2t5c3QudmVyY2VsLmFwcCIsImh0dHBzOi8vZGV2LXFjNmttM3UzdXc2bmhkNGIudXMuYXV0aDAuY29tL3VzZXJpbmZvIl0sImlhdCI6MTc1MDUwNDAxOCwiZXhwIjoxNzUwNTkwNDE4LCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIiwiYXpwIjoiR0dZUEdQTEJkQkltTlJYVEZIQ0ZVTDl5TzFubFdaSlcifQ.zK8-ojgQl4NQwqFNRPxVJYot8P7J9QrzvINMMCPqla-_VZ5StglBhWodaUCMX357jvXsdBR4fNUEJc3TX_p08__swr6O1bEIJWEmfk5B3Efr-XevSNQhE2-qm6jmSUYhyvOhuBjC6WsoThNlARVL2NugOLEeN-1nYF7VeTeREDdK-q_at44yPzFPcSLEPJZg0Cx_XUkKfNtqaamKeDpWdRjfVFSIWUktZTOhXX3FJXAdg6_wlxEQz9N13_aelcKcCfa31UyLWlHoRijG9MdKqH4xz4SuOcT8g2G7MuJloXvXIETXhn1rbCOxgVElc2hfCiEzMrdr9LtOJRfaX_L54A'};
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
    return Promise.reject(error);
  }
);
