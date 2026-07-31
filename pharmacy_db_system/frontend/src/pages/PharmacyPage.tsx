import React, { useState, useEffect } from "react";
import { PageWrapper } from "../components/layout/PageWrapper";
import { useLanguage } from "../context/LanguageContext";
import { usePharmacy } from "../context/PharamcyContext";
import { useAuth } from "../context/AuthContext";
import { pharmacyAPI } from "../api/pharmacyAPI";
import { useToast } from "../context/ToastContext";
import { useSupabaseUpload } from "../hooks/useSupabaseUpload";
import { Button } from "../components/ui/Button";

export const PharmacyPage: React.FC = () => {
  const { t } = useLanguage();
  const { pharmacy, setPharmacy } = usePharmacy();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    work_time: pharmacy?.work_time || "",
    logo: pharmacy?.logo || "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isUpdating, setIsUpdating] = useState(false);

  const { uploadFile, uploading, error } = useSupabaseUpload({
    bucketName: "avatars",
  });

  const handleLogoChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (event.target.files) {
      const file = event.target.files[0];
      if (!file) return;
      const publicUrl = await uploadFile(file);
      if (publicUrl) {
        setFormData((prev) => ({
          ...prev,
          logo: publicUrl,
        }));
      }
    }
  };

  useEffect(() => {
    if (pharmacy) {
      setFormData({
        work_time: pharmacy.work_time,
        logo: pharmacy.logo || "",
      });
    }
  }, [pharmacy]);

  // Check role: Only role_id 1 (Admin) or 2 (Owner) can view/edit
  if (!user || (user.role_id !== 1 && user.role_id !== 2)) {
    return (
      <PageWrapper>
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-red-600">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to view this page.</p>
        </div>
      </PageWrapper>
    );
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pharmacy) return;

    const newErrors: Record<string, string> = {};

    // Restore empty fields to original state before validation if they are empty
    const finalWorkTime = formData.work_time.trim() === "" ? pharmacy.work_time : formData.work_time;
    const finalLogo = formData.logo.trim() === "" ? (pharmacy.logo || "") : formData.logo;

    // Validation on final values
    if (!finalWorkTime.trim()) {
      newErrors.work_time = t("pharmacy.requiredWorkTime");
    } else if (finalWorkTime.length < 10) {
      newErrors.work_time = t("pharmacy.workTimeTooShort");
    } else if (finalWorkTime.length > 50) {
      newErrors.work_time = t("pharmacy.workTimeTooLong");
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsUpdating(true);
      try {
        const updatedPharmacy = await pharmacyAPI.updatePharmacy(BigInt(pharmacy.id), {
          work_time: finalWorkTime,
          logo: finalLogo,
        });
        setPharmacy(updatedPharmacy);
        setFormData({
          work_time: updatedPharmacy.work_time,
          logo: updatedPharmacy.logo || "",
        });
        showToast(t("pharmacy.updateSuccess"), "success");
      } catch (error) {
        showToast("Failed to update pharmacy info", "error");
      } finally {
        setIsUpdating(false);
      }
    } else {
      // Sync formData with the restored values if there were errors or empty fields
      setFormData({
        work_time: finalWorkTime,
        logo: finalLogo,
      });
    }
  };

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            {t("pharmacy.updateInfoTitle")}
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mt-2 max-w-2xl">
            {t("pharmacy.updateInfoSubtitle")}
          </p>
        </div>

        <div className="bg-white shadow-sm rounded-2xl border border-gray-100 p-6 sm:p-8">
          <form onSubmit={handleUpdate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Read-only fields if user is  not super admin */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("pharmacy.name")}
                </label>
                <input
                  type="text"
                  value={pharmacy?.pharmacy_name || ""}
                  disabled={user?.role_id !== 1 && true}
                  className={`w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-gray-500 ${user?.role_id !==1 && 'cursor-not-allowed'}`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("pharmacy.address")}
                </label>
                <input
                  type="text"
                  value={pharmacy?.pharmacy_address || ""}
                  disabled
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-gray-500 cursor-not-allowed"
                />
              </div>

              {/* Editable fields */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("pharmacy.workTime")}
                </label>
                <textarea
                  value={formData.work_time}
                  onChange={(e) => setFormData({ ...formData, work_time: e.target.value })}
                  className={`w-full border rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.work_time ? "border-red-500 shadow-sm shadow-red-100" : "border-gray-200"
                  }`}
                  rows={3}
                />
                {errors.work_time && (
                  <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.work_time}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("pharmacy.logo")}
                </label>
                <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                  <div className="relative group">
                    <img
                      src={formData.logo || "/placeholder-logo.png"}
                      alt="Logo preview"
                      className="size-20 rounded-full object-cover border-2 border-white shadow-md transition-transform group-hover:scale-105"
                      onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/150")}
                    />
                    {uploading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full">
                        <div className="size-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      id="logo-upload"
                      onChange={handleLogoChange}
                      disabled={uploading}
                      accept="image/*"
                      className="hidden"
                    />
                    <label
                      htmlFor="logo-upload"
                      className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors shadow-sm"
                    >
                      {uploading ? t("common.uploading") : t("common.select")}
                    </label>
                    <p className="mt-2 text-xs text-gray-500">
                      PNG, JPG up to 2MB
                    </p>
                    {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-6 border-t border-gray-100">
              <button
                type="submit"
                disabled={isUpdating || uploading}
                className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-blue-500/20"
              >
                {isUpdating ? t("common.loading") : t("common.update")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </PageWrapper>
  );
};
