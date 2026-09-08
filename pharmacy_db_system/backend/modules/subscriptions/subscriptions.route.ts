import { Router } from 'express';
import { SubscriptionController } from './subscriptions.controller';

const router = Router();
const controller = new SubscriptionController();

// مسارات الخطط (Plans)
router.post('/plans', controller.createPlanController);
router.put('/plans/:id', controller.createPlanController);

// مسارات الاشتراكات (Subscriptions)
router.post('/create', controller.createSubscriptionController);
router.get('/list', controller.listSubscriptionsController);
router.post('/:id/renew', controller.renewSubscriptionController);
router.post('/:id/suspend', controller.suspendSubscriptionController);
router.post('/:id/activate', controller.activateSubscription);

export default router;