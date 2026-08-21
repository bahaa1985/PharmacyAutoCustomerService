import React, { useEffect, useState } from "react";
import { subscriptionAPI } from "../../api/subscriptionAPI";
import { type PharmacyPlan, PlanState } from "../../types/subscription";
import { useLanguage } from "../../context/LanguageContext";
import { useToast } from "../../context/ToastContext";

export const PharmacySubscriptionList: React.FC = () => {
  const [pharmPlan, setPharmPlan] = useState<PharmacyPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();
  const { showToast } = useToast();

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const data = await subscriptionAPI.getAllPharmacyPlans();
      console.log("plans",data);
      setPharmPlan(data);
    } catch (error) {
      showToast(t("common.error"),error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleRenewBilling = async (plan: PharmacyPlan) => {
    try {
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);

      await subscriptionAPI.renewPharmacyBilling({
        pharmacy_id: plan.pharmacy_id,
        plan_id: plan.plan_id,
        amount_paid: Number(plan.plans?.price || 0),
        bill_due: nextMonth.toISOString().split("T")[0],
        // paid: true,
        billing_month: new Date().toISOString().split("T")[0],
        messages_used: 0,
        state: PlanState.ACTIVE,
      });
      showToast(t("common.updateSuccess"), "success");
      fetchPlans();
    } catch (error) {
      showToast(t("common.error"), error);
    }
  };

  const handleToggleState = async (
    pharmacyId: string,
    currentState: PlanState,
  ) => {
    try {
      const newState =
        currentState === PlanState.ACTIVE
          ? PlanState.SUSPENDED
          : PlanState.ACTIVE;
      await subscriptionAPI.updatePlanState(pharmacyId, newState);
      showToast(t("common.updateSuccess"), "success");
      fetchPlans();
    } catch (error) {
      showToast(t("common.error"),error);
    }
  };

  if (loading) return null;

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 dark:bg-gray-700 border-b dark:border-gray-600">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">
                {t("subscriptions.pharmacy")}
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">
                {t("subscriptions.plan")}
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">
                {t("subscriptions.status")}
              </th>
              {/* <th className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">
                {t("subscriptions.payment")}
              </th> */}
              <th className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">
                {t("subscriptions.messages")}
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">
                {t("subscriptions.expiry")}
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white text-center">
                {t("common.details")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {pharmPlan.length > 0 ? (
              pharmPlan.map((plan) => (
                <tr
                  key={plan.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                >
                  <td className="px-6 py-4 text-sm dark:text-gray-300">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {plan.pharmacies?.pharmacy_name}
                    </div>
                    <div className="text-xs text-gray-500">ID: {plan.pharmacy_id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {plan.plans?.name}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        plan.state === PlanState.ACTIVE
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}
                    >
                      {t(`subscriptions.${plan.state.toLowerCase()}`)}
                    </span>
                  </td>
                  {/* <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        plan.paid
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                      }`}
                    >
                      {plan.paid ? t("subscriptions.paid") : t("subscriptions.unpaid")}
                    </span>
                  </td> */}
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {plan.messages_count} / {plan.plans?.messages_limit}
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-2">
                      <div
                        className="bg-primary h-1.5 rounded-full"
                        style={{
                          width: `${Math.min((plan.messages_count / (plan.plans?.messages_limit || 1)) * 100, 100)}%`,
                        }}
                      ></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {new Date(plan.bill_due).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-center space-x-2 rtl:space-x-reverse">
                    <button
                      onClick={() => handleRenewBilling(plan)}
                      className="px-3 py-1 text-xs rounded border border-blue-500 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                    >
                      {t("subscriptions.renew")}
                    </button>
                    <button
                      onClick={() => handleToggleState(plan.pharmacy_id, plan.state)}
                      className={`px-3 py-1 text-xs rounded border transition-colors ${
                        plan.state === PlanState.ACTIVE
                          ? "border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                          : "border-green-500 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20"
                      }`}
                    >
                      {plan.state === PlanState.ACTIVE
                        ? t("subscriptions.suspend")
                        : t("subscriptions.activate")}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                >
                  {t("subscriptions.noSubscriptions")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
