import { IBaseEntity } from "./generic";

export interface IUser extends IBaseEntity {
  auth0Id: string;
  name: string;
  email: string;
  phoneNumber: string;
  picture: string;
  bio: string;
  publicProfile: boolean;
  stripeCustomerId: string;
}

export interface IUpdateUserInput {
  name?: string;
  bio?: string;
  phoneNumber?: string;
  publicProfile?: boolean;
  picture?: string;
}
