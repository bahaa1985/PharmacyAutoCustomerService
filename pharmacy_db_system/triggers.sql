-- ==========================================
-- 1. دالة وتريجر زيادة عدد الرسائل
-- ==========================================
CREATE OR REPLACE FUNCTION increment_pharmacy_messages_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE pharmacy_plan
    SET messages_count = messages_count + 1
    WHERE pharmacy_id = NEW.pharmacy_id; 

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_increment_messages_count ON messages;
CREATE TRIGGER trigger_increment_messages_count
AFTER INSERT ON messages
FOR EACH ROW
WHEN (NEW.message_type = 4)
EXECUTE FUNCTION increment_pharmacy_messages_count();


-- ==========================================
-- 2. دالة وتريجر التجديد (عند تأكيد الدفع)
-- ==========================================
CREATE OR REPLACE FUNCTION process_pharmacy_plan_renewal()
RETURNS TRIGGER AS $$
DECLARE
    current_plan_price DECIMAL(10, 2);
BEGIN
    -- يشتغل فقط لو الدفع اتحول لـ true
    IF NEW.paid = TRUE AND OLD.paid = FALSE THEN

        SELECT price INTO current_plan_price FROM plans WHERE id = NEW.plan_id;

        -- الأرشفة
        INSERT INTO monthly_billing_logs (
            pharmacy_id, plan_id, billing_month, messages_used, amount_paid, created_at
        ) VALUES (
            NEW.pharmacy_id, NEW.plan_id, OLD.bill_due, NEW.messages_count, COALESCE(current_plan_price, 0.00), NOW()
        );

        -- تصفير العداد
        NEW.messages_count := 0;

        -- تمديد التاريخ (بيحسب تلقائي لو مفيش تاريخ جديد مبعوت من الـ UI)
        IF NEW.bill_due = OLD.bill_due THEN
             IF OLD.bill_due < NOW() THEN
                 NEW.bill_due := NOW() + INTERVAL '1 month';
             ELSE
                 NEW.bill_due := OLD.bill_due + INTERVAL '1 month';
             END IF;
        END IF;

        -- ضبط الحالات (تغيير state لـ ACTIVE هيشغل تريجر المزامنة تلقائياً عشان يفتح اليوزرز)
        NEW.paid := FALSE;
        NEW.state := 'ACTIVE';
        NEW.trial := FALSE;

    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_pharmacy_plan_renewal ON pharmacy_plan;
CREATE TRIGGER trigger_pharmacy_plan_renewal
BEFORE UPDATE ON pharmacy_plan
FOR EACH ROW
EXECUTE FUNCTION process_pharmacy_plan_renewal();


-- ==========================================
-- 3. دالة وتريجر التعليق التلقائي (لانتهاء الاشتراك)
-- ==========================================
CREATE OR REPLACE FUNCTION check_pharmacy_plan_suspension()
RETURNS TRIGGER AS $$
BEGIN
    -- يشتغل لو التاريخ انتهى ومفيش دفع ومفيش فترة تجريبية والحالة مش معلقة بالفعل
    IF NEW.bill_due < NOW() AND NEW.paid = FALSE AND NEW.trial = FALSE AND OLD.state != 'SUSPENDED' THEN
        -- تغيير الحالة (تغيير state لـ SUSPENDED هيشغل تريجر المزامنة تلقائياً عشان يقفل اليوزرز)
        NEW.state := 'SUSPENDED';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_check_pharmacy_plan_suspension ON pharmacy_plan;
CREATE TRIGGER trigger_check_pharmacy_plan_suspension
BEFORE UPDATE ON pharmacy_plan
FOR EACH ROW
EXECUTE FUNCTION check_pharmacy_plan_suspension();


-- ==========================================
-- 4. دالة وتريجر مزامنة حالة الصيدلية مع حسابات المستخدمين
-- ==========================================
CREATE OR REPLACE FUNCTION sync_pharmacy_state_with_users()
RETURNS TRIGGER AS $$
BEGIN
    -- لو الحالة اتغيرت لـ ACTIVE (سواء من تريجر التجديد أو يدوياً من الـ UI)
    IF NEW.state = 'ACTIVE' AND OLD.state != 'ACTIVE' THEN
        UPDATE users SET is_active = TRUE, ai_mode = TRUE WHERE pharmacy_id = NEW.pharmacy_id;
    END IF;

    -- لو الحالة اتغيرت لـ SUSPENDED (سواء من تريجر التعليق أو يدوياً من الـ UI)
    IF NEW.state = 'SUSPENDED' AND OLD.state != 'SUSPENDED' THEN
        UPDATE users SET is_active = FALSE WHERE pharmacy_id = NEW.pharmacy_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_sync_pharmacy_state ON pharmacy_plan;
CREATE TRIGGER trigger_sync_pharmacy_state
AFTER UPDATE OF state ON pharmacy_plan
FOR EACH ROW
WHEN (NEW.state IS DISTINCT FROM OLD.state)
EXECUTE FUNCTION sync_pharmacy_state_with_users();

CREATE OR REPLACE FUNCTION check_pharmacy_message_limit()
RETURNS TRIGGER AS $$
DECLARE
    plan_limit INT;
BEGIN
    -- جلب حد الرسائل المحدد في الخطة (plans model)
    SELECT messages_limit INTO plan_limit 
    FROM plans 
    WHERE id = NEW.plan_id;

    -- إذا تجاوز عدد الرسائل أو وصل للحد الأقصى وكانت الحالة ليست معلقة بالفعل
    IF plan_limit IS NOT NULL AND NEW.messages_count >= plan_limit AND OLD.state != 'SUSPENDED' THEN
        NEW.state := 'SUSPENDED';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ربط التريجر ليعمل قبل أي تحديث على عداد الرسائل أو تغيير الخطة
DROP TRIGGER IF EXISTS trigger_check_pharmacy_message_limit ON pharmacy_plan;
CREATE TRIGGER trigger_check_pharmacy_message_limit
BEFORE UPDATE OF messages_count, plan_id ON pharmacy_plan
FOR EACH ROW
EXECUTE FUNCTION check_pharmacy_message_limit();