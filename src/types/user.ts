import { IBaseEntity } from "./generic";

export interface IUser extends IBaseEntity {
  clerkUserId: string;
  email: string;
}

export interface IUpdateUserInput {
  name?: string;
  bio?: string;
  phoneNumber?: string;
  publicProfile?: boolean;
  picture?: string;
}
