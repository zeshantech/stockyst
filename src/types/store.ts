import { IBaseEntity } from "./generic";

export interface IStore extends IBaseEntity {
  name: string;
  address: string;
  city: string;
  country: string;
  phoneNumber: string;
  email: string;
  type: string;
  logoUrl: string;
  active: boolean;
  stripeSubscriptionId: string;
  stripeCustomerId: string;
}

export interface ICreateStoreInput {
  name: string;
  address: string;
  city: string;
  country: string;
  phoneNumber: string;
  email: string;
  type: string;
  logoUrl: string;
}

export interface IUpdateStoreInput {
  ID: string;
  name: string;
  address: string;
  city: string;
  country: string;
  phoneNumber: string;
  email: string;
  type: string;
  logoUrl: string;
}

export interface ICreateStoreOutput {
  clientSecret: string;
  paymentIntentId: string;
  amount: number;
}