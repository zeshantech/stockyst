import { api } from "./api";
import axios, { AxiosError } from "axios";

// Types for authentication
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
    roles: string[];
  };
}

// Authentication functions
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  try {
    const response = await api.post<AuthResponse>("/auth/login", credentials);
    
    // Store the token in localStorage
    localStorage.setItem("token", response.data.token);
    
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 401) {
        throw new Error("Invalid credentials");
      }
      throw new Error(error.response?.data?.message || "Authentication failed");
    }
    throw new Error("An unexpected error occurred");
  }
}

export async function logout(): Promise<void> {
  try {
    // Call the logout endpoint if needed
    await api.post("/auth/logout");
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    // Always remove the token
    localStorage.removeItem("token");
  }
}

export async function register(userData: {
  username: string;
  email: string;
  password: string;
}): Promise<AuthResponse> {
  try {
    const response = await api.post<AuthResponse>("/auth/register", userData);
    
    // Store the token in localStorage
    localStorage.setItem("token", response.data.token);
    
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 409) {
        throw new Error("User already exists");
      }
      throw new Error(error.response?.data?.message || "Registration failed");
    }
    throw new Error("An unexpected error occurred");
  }
}

export function isAuthenticated(): boolean {
  return !!localStorage.getItem("token");
}

export async function getCurrentUser() {
  try {
    const response = await api.get("/auth/user");
    return response.data;
  } catch (error) {
    // If there's an error, clear the token and return null
    localStorage.removeItem("token");
    return null;
  }
}

export async function resetPassword(email: string): Promise<void> {
  try {
    await api.post("/auth/reset-password", { email });
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || "Password reset failed");
    }
    throw new Error("An unexpected error occurred");
  }
}

export async function updatePassword(
  token: string, 
  newPassword: string
): Promise<void> {
  try {
    await api.post("/auth/update-password", { token, newPassword });
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || "Password update failed");
    }
    throw new Error("An unexpected error occurred");
  }
} 