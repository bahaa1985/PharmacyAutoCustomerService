import { prismaClient } from '../../utils/prisma-adapter';

export class SubscriptionService {
  // 1. إنشاء أو تحديث الخطط (Plans)
  async upsertPlan(id: number | undefined, data: { name: string; price: number; messages_limit: number }) {
    if (id) {
      return prismaClient.plans.update({
        where: { id },
        data,
      });
    }
    return prismaClient.plans.create({
      data,
    });
  }

  // 2. إنشاء اشتراك جديد (التريجر في الداتابيز سيتولى إنهاء القديم وتصفير العدادات)
  async createSubscription(pharmacyId: number, planId: number, billDue: Date) {
    return prismaClient.subscriptions.create({
      data: {
        pharmacy_id: pharmacyId,
        plan_id: planId,
        bill_due: billDue,
        subscription_state: 'ACTIVE',
        messages_used: 0,
        images_count: 0,
        next_month_paid: false,
      },
    });
  }

  // 3. تجديد الاشتراك يدوياً وأرشفة الشهر القديم
  async renewSubscription(subscriptionId: number) {
    const sub = await prismaClient.subscriptions.findUnique({
      where: { id: subscriptionId },
    });

    if (!sub) throw new Error('Subscription not found');

    // نقل بيانات الشهر الحالي إلى سجلات الأرشيف
    await prismaClient.monthly_subscription_logs.create({
      data: {
        pharmacy_plan_id: sub.id,
        billing_month: sub.bill_due,
        messages_used: sub.messages_used,
        images_count: sub.images_count,
        amount_paid: 0, // يمكن تعديلها حسب نظام الدفع لديك
        discount: 0,
      },
    });

    // تحديث تاريخ الاستحقاق وتصفير العدادات وتفعيل الاشتراك
    return prismaClient.subscriptions.update({
      where: { id: subscriptionId },
      data: {
        bill_due: new Date(new Date(sub.bill_due).setMonth(new Date(sub.bill_due).getMonth() + 1)),
        messages_used: 0,
        images_count: 0,
        next_month_paid: false,
        subscription_state: 'ACTIVE',
      },
    });
  }

  // 4. تعليق الاشتراك
  async suspendSubscription(subscriptionId: number) {
    return prismaClient.subscriptions.update({
      where: { id: subscriptionId },
      data: { subscription_state: 'SUSPENDED' },
    });
  }

  // 5. تفعيل الاشتراك
  async activateSubscription(subscriptionId: number) {
    return prismaClient.subscriptions.update({
      where: { id: subscriptionId },
      data: { subscription_state: 'ACTIVE' },
    });
  }

  // 6. استعراض كل الاشتراكات مرتبة من الأحدث
  async listAllSubscriptions() {
    return prismaClient.subscriptions.findMany({
      orderBy: { subscription_start: 'desc' },
      include: {
        pharmacies: true,
        plans: true,
      },
    });
  }
}