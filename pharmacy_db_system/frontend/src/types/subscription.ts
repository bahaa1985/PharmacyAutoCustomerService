import  type {Pharmacy}  from "./pharmacy";

export const PlanState = {
  ACTIVE: "ACTIVE",
  SUSPENDED: "SUSPENDED",
  EXPIRED: "EXPIRED",
  CANCELED: "CANCELED",
} as const;

export type PlanState = typeof PlanState[keyof typeof PlanState];


export interface Plan {
  id: number;
  name: string;
  messages_limit: number;
  price: number;
  common_replies: boolean;
  prescription_reader: boolean;
  prescription_reader_100:boolean;
  order_notification: boolean;
  basic_dashboard:boolean;
  advanced_dashboard: boolean;
}

export interface PharmacyPlan {
  id: string; // BigInt serialized as string
  pharmacy_id: string;
  plan_id: number;
  subscription_start: string;
  // Enriched fields from latest billing log
  state: PlanState;
  bill_due: string;
  messages_count: number;
  images_count:number,
  paid: boolean;
  pharmacies?: Pharmacy;
  plans?: Plan;
}

export interface MonthlyBillingLog {
  id: string;
  pharmacy_id: string;
  plan_id: number;
  bill_due: string;
  state: PlanState;
  billing_month: string;
  messages_used: number;
  amount_paid: number;
  created_at: string;
}

