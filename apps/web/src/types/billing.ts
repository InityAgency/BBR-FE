export interface BillingTransaction {
  id: string;
  userId: string;
  stripePaymentIntentId: string;
  stripeInvoiceId: string;
  stripeProductId: string;
  stripePriceId: string;
  stripeHostingInvoiceUrl: string | null;
  type: string;
  amount: string;
  currency: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  customer: {
    id: string;
    userId: string;
    stripeCustomerId: string;
    createdAt: string;
    updatedAt: string;
  };
  user: {
    id: string;
    fullName: string;
    email: string;
    companyId: string;
    status: string;
    emailVerified: boolean;
    createdAt: string;
    updatedAt: string;
  };
} 