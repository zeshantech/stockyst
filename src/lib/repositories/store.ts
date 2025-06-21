import { api } from "../api";
import { ICreateStoreInput, IStore, IUpdateStoreInput } from "@/types/store";

export async function getStores() {
  const res = await api.get<IStore[]>("/store");

  return res.data;
}

export async function updateStore(id: string, input: IUpdateStoreInput) {
  const res = await api.put<IStore>(`/store/${id}`, input);

  return res.data;
}

export async function createStore(input: ICreateStoreInput) {
  const res = await api.post<IStore>("/store", input);

  return res.data;
}
