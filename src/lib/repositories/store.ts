import { apiCall } from "../api";
import { ICreateStoreInput, ICreateStoreOutput, IStore, IUpdateStoreInput } from "@/types/store";

export async function getStores() {
  const res = await apiCall<IStore[]>("/store", "GET");

  return res;
}

export async function updateStore(id: string, input: IUpdateStoreInput) {
  const res = await apiCall<IStore>(`/store/${id}`, "PUT", input);

  return res;
}

export async function createStore(input: ICreateStoreInput) {
  const res = await apiCall<ICreateStoreOutput | null>("/store", "POST", input);

  return res;
}

export async function completeStorePayment(paymentIntentId: string, storeData: ICreateStoreInput) {
  const res = await apiCall<IStore>(`/store/${paymentIntentId}/payment-complete`, "POST", storeData);

  return res;
}
