import api from "./axios";
import type { MonthlyBillingLog, PharmacyPlan, Plan, PlanState } from "../types/subscription";

export const subscriptionAPI = {
  /**
   * Get all pharmacy plans
   */
  getAllPharmacyPlans: async (): Promise<PharmacyPlan[]> => {
    const response = await api.get("/subscriptions");
    return response.data.data;
  },

  /**
   * Get current plan for a specific pharmacy
   */
  getPharmacyPlan: async (pharmacyId: number | string): Promise<PharmacyPlan> => {
    const response = await api.get(`/subscriptions/${pharmacyId}`);
    return response.data.data;
  },

  /**
   * Update payment status for a pharmacy
   */
  updatePaymentStatus: async (pharmacyPlanId: bigint, paid: boolean): Promise<PharmacyPlan> => {
    const response = await api.patch(`/subscriptions/${pharmacyPlanId}/payment`, { paid });
    return response.data.data;
  },

  /**
   * Update plan state for a pharmacy
   */
  updatePlanState: async (pharmacyId: number | string, state: PlanState): Promise<PharmacyPlan> => {
    const response = await api.patch(`/subscriptions/${pharmacyId}/state`, { state });
    return response.data.data;
  },

  // Plan CRUD
  getPlans: async (): Promise<Plan[]> => {
    const response = await api.get("/subscriptions/plans/all");
    return response.data.data;
  },
  createPlan: async (data: any): Promise<Plan> => {
    const response = await api.post("/subscriptions/plans/create", data);
    return response.data.data;
  },
  updatePlan: async (id: number, data: any): Promise<Plan> => {
    const response = await api.put(`/subscriptions/plans/update/${id}`, data);
    return response.data.data;
  },
  deletePlan: async (id: number): Promise<Plan> => {
    const response = await api.delete(`/subscriptions/plans/delete/${id}`);
    return response.data.data;
  },

  // create new pharamcy plan
  createPharmacySubscription: async (data: {
    pharmacy_id: string | number;
    plan_id: number;
  }): Promise<PharmacyPlan> => {
    const response = await api.post("/subscriptions/pharmacy-plan/create", data);
    return response.data.data;
  },
  
  //renew a subscription
  renewPharmacyBilling: async (data: {
    pharmacy_id: string | number;
    plan_id: number;
    amount_paid: number;
    bill_due: string;
    billing_month: string;
    messages_used: number;
    state: PlanState;
  }): Promise<MonthlyBillingLog> => {
    const response = await api.post("/subscriptions/monthly-billing-log", data);
    return response.data;
  },
};

