import { ISchema } from "./generic";

export interface ILocation extends ISchema {
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  type: "warehouse" | "store" | "distribution-center";
  status: "active" | "inactive" | "maintenance";
  capacity: number;
  currentStock: number;
  manager: string;
  phone: string;
  email: string;
  operatingHours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };

  notes?: string;
}

export interface CreateLocationParams {
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  type: ILocation["type"];
  status: ILocation["status"];
  capacity: number;
  manager: string;
  phone: string;
  email: string;
  operatingHours: ILocation["operatingHours"];
  notes?: string;
}

export interface UpdateLocationParams extends Partial<CreateLocationParams> {
  id: string;
}

export interface DeleteLocationParams {
  id: string;
}

export interface BulkDeleteLocationsParams {
  ids: string[];
}

export interface BulkUploadLocationsParams {
  formData: FormData;
}
