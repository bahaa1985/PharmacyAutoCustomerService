import api from "./axios";
import { PlanState } from "../types/subscription";
import type { MonthlyBillingLog, PharmacyPlan, Plan } from "../types/subscription";

export const subscriptionAPI = {
  /**
   * Get all pharmacy subscriptions.
   * The backend exposes this list endpoint rather than a dedicated /subscriptions root listing.
   */
  getAllPharmacyPlans: async (): Promise<PharmacyPlan[]> => {
    const response = await api.get("/subscriptions/list");
    return response.data.data;
  },

  /**
   * Get current subscription for a specific pharmacy.
   * The backend does not expose a direct GET by pharmacy endpoint, so we read the list and filter it.
   */
  getPharmacyPlan: async (pharmacyId: number): Promise<PharmacyPlan> => {
    const response = await api.get("/subscriptions/list");
    const subscription = response.data.data.find(
      (item: PharmacyPlan) => Number(item.pharmacy_id) === Number(pharmacyId)
    );

    if (!subscription) {
      throw new Error("Subscription not found");
    }

    return subscription;
  },

  /**
   * This backend route does not currently expose a payment toggle endpoint.
   */
  // updatePaymentStatus: async (_pharmacyPlanId: number, _paid: boolean): Promise<PharmacyPlan> => {

  //   throw new Error("Payment status endpoint is not available in the current backend routes");
  // },

  /**
   * Update a subscription state by hitting the activate/suspend endpoints.
   */
  updatePlanState: async (subscriptionId: number | string, state: PlanState): Promise<PharmacyPlan> => {
    const endpoint = state === PlanState.ACTIVE ? "activate" : "suspend";
    const response = await api.post(`/subscriptions/${subscriptionId}/${endpoint}`);
    return response.data.data;
  },

  // Plan CRUD
  getPlans: async (): Promise<Plan[]> => {
    const response = await api.get("/subscriptions/list");
    const plans = (response.data.data ?? [])
      .map((item: any) => item.plans)
      .filter(Boolean);

    return plans.filter(
      (plan: Plan, index: number, array: Plan[]) =>
        array.findIndex((item) => item.id === plan.id) === index
    );
  },

  createPlan: async (data: any): Promise<Plan> => {
    const response = await api.post("/subscriptions/plans", data);
    return response.data.data;
  },

  updatePlan: async (id: number, data: any): Promise<Plan> => {
    const response = await api.put(`/subscriptions/plans/${id}`, data);
    return response.data.data;
  },

  // create new pharmacy subscription
  createPharmacySubscription: async (data: {
    pharmacy_id: string | number;
    plan_id: number;
    bill_due?: string;
  }): Promise<PharmacyPlan> => {
    const payload = {
      ...data,
      bill_due: data.bill_due ?? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    };

    const response = await api.post("/subscriptions/create", payload);
    return response.data.data;
  },

  // renew a subscription
  renewPharmacyBilling: async (data: {
    pharmacy_id?: string | number;
    plan_id?: number;
    amount_paid?: number;
    bill_due?: string;
    billing_month?: string;
    messages_used?: number;
    state?: PlanState;
    subscriptionId?: number;
  }): Promise<MonthlyBillingLog> => {
    let subscriptionId = data.subscriptionId;

    if (!subscriptionId && data.pharmacy_id != null) {
      const response = await api.get("/subscriptions/list");
      const subscription = (response.data.data ?? []).find(
        (item: any) => Number(item.pharmacy_id) === Number(data.pharmacy_id)
      );

      if (!subscription) {
        throw new Error("Subscription not found for this pharmacy");
      }

      subscriptionId = Number(subscription.id);
    }

    if (!subscriptionId) {
      throw new Error("Subscription id is required to renew a subscription");
    }

    const response = await api.post(`/subscriptions/${subscriptionId}/renew`);
    return response.data;
  },
};

