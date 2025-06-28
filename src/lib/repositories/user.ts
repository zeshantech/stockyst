import { IUpdateUserInput, IUser } from "@/types/user";
import { apiCall } from "../api";

export async function getCurrentUser() {
  return apiCall<IUser>("/user/me", "GET");
}

export async function updateUser(input: IUpdateUserInput) {
  return apiCall<IUser>("/user", "PATCH", input);
}
