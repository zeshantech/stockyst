import { ISchema } from "./generic";
import { IAddress } from "./order";

export interface ISupplier extends ISchema {
  name: string;
  email: string;
  phone: string;
  address: IAddress;
  status: "active" | "inactive";
  products: number;
  lastOrder: string;
}

export interface CreateSupplierParams {
  name: string;
  email: string;
  phone: string;
  address: IAddress;
  status: "active" | "inactive";
}

export interface UpdateSupplierParams extends Partial<CreateSupplierParams> {
  id: string;
}

export interface DeleteSupplierParams {
  id: string;
}

export interface ToggleSupplierStatusParams {
  id: string;
}
