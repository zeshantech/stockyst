import { ISchema } from "./generic";

export interface IStore extends ISchema {
  name: string;
  address?: string;
  city?: string;
  country?: string;
  phone?: string;
  email?: string;
  logo?: string;
  type?: string;
}
