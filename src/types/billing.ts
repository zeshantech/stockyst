export interface IPaymentIntentResponse {
  requiresPaymentMethod: boolean;
  clientSecret: string;
  paymentIntentId: string;
  amount: number;
}
