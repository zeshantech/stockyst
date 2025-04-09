import { ISchema } from "./generic";

export interface IMail extends ISchema {
  name: string; // Sender's name
  email: string; // Sender's email
  subject: string; // Email subject
  text: string; // Email body
  read: boolean; // Read status
  labels: string[]; // Tags or labels for the email
}
