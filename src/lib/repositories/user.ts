import { IUpdateUserInput, IUser } from "@/types/user";
import { api } from "../api";

export async function getCurrentUser() {
  const res = await api.get<IUser>("/user/me");

  return res.data;
}

export async function updateUser(input: IUpdateUserInput) {
  const res = await api.patch<IUser>("/user", input);

  return res.data;
}
