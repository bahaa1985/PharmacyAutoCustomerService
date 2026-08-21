import express from "express";
import * as subscriptionController from "./subscriptions.controller";
import bodyParser from "body-parser";

export const SUBSCRIPTION_ROUTER = express.Router();

SUBSCRIPTION_ROUTER.use(bodyParser.json());

// Get all pharmacy plans
SUBSCRIPTION_ROUTER.get("/", subscriptionController.getAllPharmacyPlans);

// Plans CRUD
SUBSCRIPTION_ROUTER.get("/plans/all", subscriptionController.getAllPlans);
SUBSCRIPTION_ROUTER.post("/plans/create", subscriptionController.createPlan);
SUBSCRIPTION_ROUTER.put("/plans/update/:id", subscriptionController.updatePlan);
SUBSCRIPTION_ROUTER.delete("/plans/delete/:id", subscriptionController.deletePlan);

SUBSCRIPTION_ROUTER.post("/pharmacy-plan/create", subscriptionController.createPharmacyPlan);

// Get current plan for a pharmacy
SUBSCRIPTION_ROUTER.get("/:pharmacyId", subscriptionController.getPharmacyPlan);

// Update payment status
// SUBSCRIPTION_ROUTER.patch("/:pharmacyPlanId/payment", subscriptionController.updatePaymentStatus);

//Renew subscription billing
SUBSCRIPTION_ROUTER.post("/monthly-billing-log",subscriptionController.renewPharmacyBillingController)

// Update plan state (ACTIVE, SUSPENDED, etc.)
SUBSCRIPTION_ROUTER.patch("/:pharmacyId/state", subscriptionController.updatePlanState);

//Get pharmacy billing log
SUBSCRIPTION_ROUTER.get("/pharamcy-billing-log",subscriptionController.getPharamcyBillingLogController)
