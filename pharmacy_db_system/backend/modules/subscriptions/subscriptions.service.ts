import { prismaClient } from "../../utils/prisma-adapter";
import { PlanState } from "@prisma/client";

// export const updatePaymentStatus = async (pharmacyId: bigint, paid: boolean) => {
//   try {
//     // Update the latest billing log
//     const latestLog = await prismaClient.monthly_billing_logs.findFirst({
//       where: { pharmacy_id: pharmacyId },
//       orderBy: { billing_month: 'desc' }
//     });

//     if (!latestLog) throw new Error("Billing log not found");

//     return await prismaClient.monthly_billing_logs.update({
//       where: { id: latestLog.id },
//       data: { paid }
//     });
//   } catch (error) {
//     console.error("Error updating payment status:", error);
//     throw error;
//   }
// };

export const updatePlanState = async (pharmacyId: bigint, state: PlanState) => {
  try {
    const latestLog = await prismaClient.monthly_billing_logs.findFirst({
      where: { pharmacy_id: pharmacyId },
      orderBy: { billing_month: 'desc' }
    });

    if (!latestLog) throw new Error("Billing log not found");

    return await prismaClient.monthly_billing_logs.update({
      where: { id: latestLog.id },
      data: { state }
    });
  } catch (error) {
    console.error("Error updating plan state:", error);
    throw error;
  }
};

export const getSubscriptionsByPharmacy = async (pharmacy_id:bigint) => {
  try {
    const plans = await prismaClient.pharmacy_plan.findMany({
      where:{pharmacy_id:pharmacy_id},
      include: {
        pharmacies: true,
        plans: true,
      },
    });

    const enrichedPlans = await Promise.all(plans.map(async (p) => {
      const latestLog = await prismaClient.monthly_billing_logs.findFirst({
        where: { plan_id:p.plan_id },
        orderBy: { billing_month: 'desc' }
      });
      return {
        ...p,
        state: latestLog?.state,
        bill_due: latestLog?.bill_due,
        messages_count: latestLog?.messages_used ?? 0,
      };
    }));

    return enrichedPlans;
  } catch (error) {
    console.error("Error fetching all pharmacy plans:", error);
    throw error;
  }
};

export const getAllPharmacyPlans = async () => {
  try {
    const plans = await prismaClient.pharmacy_plan.findMany({
      include: {
        pharmacies: true,
        plans: true,
      },
    });

    const enrichedPlans = await Promise.all(plans.map(async (p) => {
      const latestLog = await prismaClient.monthly_billing_logs.findFirst({
        where: { plan_id:p.plan_id },
        orderBy: { billing_month: 'desc' }
      });
      return {
        ...p,
        state: latestLog?.state,
        bill_due: latestLog?.bill_due,
        messages_count: latestLog?.messages_used ?? 0,
      };
    }));

    return enrichedPlans;
  } catch (error) {
    console.error("Error fetching all pharmacy plans:", error);
    throw error;
  }
};

// Plans CRUD
export const getAllPlans = async () => {
  try {
    return await prismaClient.plans.findMany();
  } catch (error) {
    console.error("Error fetching all plans:", error);
    throw error;
  }
};

export const createPlan = async (data: any) => {
  try {
    return await prismaClient.plans.create({
      data: {
        ...data,
        price: Number(data.price),
      },
    });
  } catch (error) {
    console.error("Error creating plan:", error);
    throw error;
  }
};

export const updatePlan = async (id: number, data: any) => {
  try {
    return await prismaClient.plans.update({
      where: { id },
      data: {
        ...data,
        price: data.price ? Number(data.price) : undefined,
      },
    });
  } catch (error) {
    console.error("Error updating plan:", error);
    throw error;
  }
};

export const deletePlan = async (id: number) => {
  try {
    return await prismaClient.plans.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Error deleting plan:", error);
    throw error;
  }
};

export const getPharmacyBillingLogService=async(pharmacy_id:bigint)=>{
  try{
    const pharmacyLog=await prismaClient.monthly_billing_logs.findMany({
      where:{
        pharmacy_id
      }
    });
    return pharmacyLog
  }
  catch(error){
    console.log("Error fetching pharamcy billing log",error);
    throw error;
  }
}

export const createMonthlyBillingLogService=async(data:any)=>{
  try{
    bill_due: (() => {
      const date = new Date();
      date.setMonth(date.getMonth() + 1);
      return  date.toISOString().split('T')[0];
    })()
    //create new billing
const billing = await prismaClient.monthly_billing_logs.create({data: data});
// //update pharmacy stte after renew
// await prismaClient.pharmacies.update({
//   where:{id:data.pharmacy_id},
//       data:{is_active:true}
//   })
    return billing
  }
  catch(error){
    console.error("Error creating pharmacy billing:", error);
    throw error;
  }
}

export const createPharmacyPlan = async (data: any) => {
  try {
    // Check if pharmacy already has a plan
    // const existing = await prismaClient.pharmacy_plan.findFirst({
    //   where: { pharmacy_id: BigInt(data.pharmacy_id), plan_id:Number(data.plan_id) }
    // });
    const validPlan = await prismaClient.monthly_billing_logs.findFirst({
      where:{pharmacy_id: BigInt(data.pharmacy_id), plan_id:Number(data.plan_id),state : 'ACTIVE'}
    })
    if (validPlan) {
      throw new Error("Pharmacy already has an existing subscription");
    }

    const plan = await prismaClient.pharmacy_plan.create({
      data: {
        pharmacy_id: BigInt(data.pharmacy_id),
        plan_id: Number(data.plan_id),
      }
    });

    // Create initial billing log
//  const bill_due= (() => {
//       const date = new Date();
//       date.setMonth(date.getMonth() + 1);
//       return  date.toISOString().split('T')[0];
//     })()
//     createMonthlyBillingLogService({
//         pharmacy_id: BigInt(data.pharmacy_id),
//         plan_id: Number(data.plan_id),
//         bill_due: new Date(bill_due),
//         messages_used: 0,
//         state: "ACTIVE",
//         amount_paid: 0,
//     })

    return plan;
  } catch (error) {
    console.error("Error creating pharmacy plan:", error);
    throw error;
  }
};
