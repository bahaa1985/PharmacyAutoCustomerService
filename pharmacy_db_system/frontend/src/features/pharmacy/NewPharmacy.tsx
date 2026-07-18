import React, { useState } from "react";
import { pharmacyAPI } from "../../api/pharmacyAPI";
import { Modal } from "../../components/ui/Modal";
import { useLanguage } from "../../context/LanguageContext";

export const NewPharmacy: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { t } = useLanguage();
  const [message, setMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = t('pharmacy.requiredName');
    if (!formData.address.trim())
      newErrors.address = t('pharmacy.requiredAddress');
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      try {
        const newPharmacy = await pharmacyAPI.createPharmacy(
          formData.name,
          formData.address,
        );
        setMessage(
          newPharmacy.pharmacy_name + t('pharmacy.created'),
        );
        setShowSuccessModal(true);
        setFormData({ name: "", address: "" });
      } catch (err) {
        const errMessage =
          err instanceof Error ? err.message : "Regestration failed";
        setMessage(errMessage);
      }
    }
  };
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">{t('pharmacy.addTitle')}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            {t('pharmacy.name')}
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            {t('pharmacy.address')}
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
          {errors.address && (
            <p className="text-red-500 text-sm mt-1">{errors.address}</p>
          )}
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => handleSubmit}
        >
          {t('pharmacy.createButton')}
        </button>
      </form>
      <Modal
        isOpen={showSuccessModal}
        title={message}
        onClose={() => setShowSuccessModal(false)}
        confirmText="OK"
        onConfirm={() => setShowSuccessModal(false)}
      >
        <p>{message}</p>
      </Modal>
    </div>
  );
};
