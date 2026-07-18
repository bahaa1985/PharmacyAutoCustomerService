import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { userAPI } from "../api/userAPI";
import type {User} from '../types/user';
import { useLanguage } from "../context/LanguageContext";
import { PageWrapper } from "../components/layout/PageWrapper";
import { Modal } from "../components/ui/Modal";


export const UserPage: React.FC = () => {
  const currentUser = useAuth().user;
  const { t } = useLanguage();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [updatedUser,setUpdatedUser]=useState<User>()
 const [showSuccessModal, setShowSuccessModal] = useState(false);
 const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: currentUser?.username || "",
    mobile: currentUser?.mobile || "",
    password: "",
    confirmPassword: "",
  });

  const handleUpdateSettings = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      const newErrors: Record<string, string> = {};
      if (!formData.username.trim())
        newErrors.username = t("users.requiredUserName");
      if (formData.username.length < 3)
        newErrors.username = t("users.invalidUserName");
      if (!formData.mobile.trim()) newErrors.mobile = t("users.requiredMobile");
      if (formData.mobile.length != 12) newErrors.mobile = t("users.invalidMobile");
        // if (!formData.password) newErrors.password = t("users.requiredPassword");
        if(formData.password.length <8 && formData.password.length >0) 
            newErrors.password= t("users.passwordTooShort")
        if(formData.password.length >20) 
            newErrors.password= t("users.passwordtTooLong")
      if (formData.password !== formData.confirmPassword)
        newErrors.confirmPassword = t("users.passwordMismatch");
      setErrors(newErrors);
      console.log("errors",newErrors);
      
      if (Object.keys(newErrors).length == 0) {
        setFormData({
          username: formData.username,
          mobile: formData.mobile,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        });
        setUpdatedUser(await userAPI.updateUser(
          BigInt(currentUser?.id || 0),
          formData,
        ));
        setShowSuccessModal(true)
        return updatedUser;
      }
    } catch (error) {
      const err = error as Error;
      setShowSuccessModal(false);
      setMessage(t("users.failedUpdate"));
    }
  };
  return (
    <PageWrapper>
      <div className="max-w-md mx-auto p-6">
        <form onSubmit={handleUpdateSettings} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("users.username")}
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              max={30}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
            />
            {errors.usrname && <span>{errors.username}</span>}
          </div>
          {currentUser?.role_id == 1 ||
            (currentUser?.role_id == 2 && (
              <div>
                <label className="block text-sm font-medium mb-1">
                  {t("users.mobile")}
                </label>
                <input
                  type="text"
                  name="mobile"
                  value={formData.mobile}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  onChange={(e) =>
                    setFormData({ ...formData, mobile: e.target.value })
                  }
                />
                {errors.mobile && <span>{errors.mobile}</span>}
              </div>
            ))}

          <div>
            <label className="block text-sm font-medium mb-1">
              {t("users.password")}
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
            {errors.password && (
              <span className="text-red-500 text-sm mt-1">
                {errors.password}
              </span>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("users.confirmPassword")}
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
            />
            {errors.confirmPassword && (
              <span className="text-red-500 text-sm mt-1">
                {errors.confirmPassword}
              </span>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700"
          >
            {t("users.updateSettingsTitle")}
          </button>
        </form>
        {message && <p>{message}</p>}
        <Modal
          isOpen={showSuccessModal}
          title={t("users.updateSuccess")}
          onClose={() => setShowSuccessModal(false)}
          confirmText="OK"
          onConfirm={()=>{
                            setShowSuccessModal(false);
                            navigate("/login")
                          }
                        }
        > <p>{message}</p>
        </Modal>
      </div>
    </PageWrapper>
  );
};
