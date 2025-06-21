import { ISchema } from "./generic";

export interface IStore extends ISchema {
  name: string;
  address: string;
  city: string;
  country: string;
  phoneNumber: string;
  email: string;
  type: string;
  logoUrl: string;
  active: boolean;
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
