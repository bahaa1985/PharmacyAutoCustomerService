import { Request, Response } from "express";
import * as subscriptionService from "./subscriptions.service";

// Helper to handle BigInt serialization
const serialize = (data: any) => {
  return JSON.parse(
    JSON.stringify(data, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );
};

// export const updatePaymentStatus = async (req: Request, res: Response) => {
//   try {
//     const { pharmacyPlanId } = req.params;

//     if (typeof paid !== "boolean") {
//       return res.status(400).json({ success: false, message: "paid must be a boolean" });
//     }

//     const result = await subscriptionService.updatePaymentStatus(BigInt(pharmacyPlanId.toString()));
//     res.status(200).json({ success: true, data: serialize(result) });
//   } catch (error: any) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

export const updatePlanState = async (req: Request, res: Response) => {
  try {
    const { pharmacyId } = req.params;
    const { state } = req.body;

    if (!state) {
      return res.status(400).json({ success: false, message: "state is required" });
    }

    const result = await subscriptionService.updatePlanState(BigInt(pharmacyId.toString()), state);
    res.status(200).json({ success: true, data: serialize(result) });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllPharmacyPlans = async (req: Request, res: Response) => {
  try {
    const plans = await subscriptionService.getAllPharmacyPlans();
    res.status(200).json({ success: true, data: serialize(plans) });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPharmacyPlan = async (req: Request, res: Response) => {
  try {
    const { pharmacyId } = req.params;
    const subscriptions = await subscriptionService.getAllPharmacyPlans();
    // const subscription = subscriptions.pop(p => p.pharmacy_id === BigInt(pharmacyId.toString()));
    const subscription = subscriptions.pop();
    
    if (!subscription) {
      return res.status(404).json({ success: false, message: "Plan not found for this pharmacy" });
    }

    res.status(200).json({ success: true, data: serialize(subscription) });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Plan handlers
export const getAllPlans = async (req: Request, res: Response) => {
  try {
    const plans = await subscriptionService.getAllPlans();
    res.status(200).json({ success: true, data: serialize(plans) });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createPlan = async (req: Request, res: Response) => {
  try {
    const plan = await subscriptionService.createPlan(req.body);
    res.status(201).json({ success: true, data: serialize(plan) });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updatePlan = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const plan = await subscriptionService.updatePlan(Number(id), req.body);
    res.status(200).json({ success: true, data: serialize(plan) });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deletePlan = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await subscriptionService.deletePlan(Number(id));
    res.status(200).json({ success: true, message: "Plan deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPharamcyBillingLogController=async (req:Request,res:Response)=>{
  try {
    const {pharmacy_id}=req.params;
    await subscriptionService.getPharmacyBillingLogService(BigInt(pharmacy_id.toString()))
    res.status(200).json({success:true,message:"Pharamcy billing log fetched successfully"});
  } catch (error:any) {
    res.status(500).json({success:false,message:error.message})
  }
}

export const renewPharmacyBillingController=async(req:Request,res:Response)=>{
  try{
    const data = req.body;
    // Handle BigInt conversion if pharmacy_id is present
    if (data.pharmacy_id) {
      data.pharmacy_id = BigInt(data.pharmacy_id);
    }
    await subscriptionService.createMonthlyBillingLogService(data);
    res.status(200).json({success:true,message:"Pharmacy Subscription Billing created successfully"});
  }
  catch(error:any){
 res.status(500).json({ success: false, message: error.message });
  }
}

export const createPharmacyPlan = async (req: Request, res: Response) => {
  try {
    const plan = await subscriptionService.createPharmacyPlan(req.body);
    res.status(201).json({ success: true, data: serialize(plan) });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};


