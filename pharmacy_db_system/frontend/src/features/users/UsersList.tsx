import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { userAPI } from "../../api/userAPI";
import { pharmacyAPI } from "../../api/pharmacyAPI";
import { Modal } from "../../components/ui/Modal";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { useToast } from "../../context/ToastContext";
import { useLanguage } from "../../context/LanguageContext";
import type { User } from "../../types/user";
import type { Pharmacy } from "../../types/pharmacy";
import Switch from "@mui/material/Switch";
import {
  Person as PersonIcon,
  Phone as PhoneIcon,
  Store as StoreIcon,
  // Badge as BadgeIcon,
  Circle as CircleIcon,
} from "@mui/icons-material";

export const UsersList: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { t } = useLanguage();
  const [users, setUsers] = useState<User[]>([]);
  const [pharmacies, setPharamacies] = useState<Pharmacy[]>([]);
  const [pharmacyId, setPharmacyId] = useState(user?.pharmacy_id || 0);
  const [selectedUser, setSelectedUser] = useState<User>();
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getPharmaciesAsync = async () => {
      const pharmacies = await pharmacyAPI.getPharmacies();
      setPharamacies(pharmacies);
    };
    if (user?.role_id.toString() === "1") getPharmaciesAsync();
  }, [user?.role_id]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await userAPI.getUsers(BigInt(pharmacyId));
        setUsers(response);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, [pharmacyId]);

  const handlePharmacyClick = (pharmacyId: number) => {
    setPharmacyId(pharmacyId);
  };

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
    setModalTitle(`${user.username}'s ${t("common.details") || "Details"}`);
    setShowModal(true);
  };

  const handleToggleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedUser) return;
    setSelectedUser({
      ...selectedUser,
      is_active: e.target.checked,
    });
  };

  const handleUserUpdate = async (userId: bigint) => {
    setLoading(true);
    try {
      const updatedUser = await userAPI.updateUser(userId, {
        is_active: selectedUser?.is_active,
        username: selectedUser?.username,
        mobile: selectedUser?.mobile,
        role_id: selectedUser?.role_id,
      });
      if (updatedUser) {
        showToast(
          `${selectedUser?.username} ${t("users.updateSuccess")}`,
          "success"
        );
        setShowModal(false);
        // Refresh users list
        const response = await userAPI.getUsers(BigInt(pharmacyId));
        setUsers(response);
      }
    } catch (error) {
      console.error("Error updating user:", error);
      showToast("Failed to update user", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {user?.role_id.toString() === "1" && (
        <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100 mb-6">
          <label className="block text-sm font-semibold text-blue-900 mb-2 flex items-center gap-2">
            <StoreIcon fontSize="small" />
            {t("users.selectPharmacy") || "Select Pharmacy"}
          </label>
          <select
            name="pharmacyId"
            value={pharmacyId}
            onChange={(e) => handlePharmacyClick(Number(e.target.value))}
            className="w-full md:w-1/3 px-3 py-2 bg-white border border-blue-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          >
            <option value={0}>All Pharmacies</option>
            {pharmacies?.map((pharmacy) => (
              <option key={pharmacy.id} value={pharmacy.id}>
                {pharmacy.pharmacy_name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user: User) => (
          <div
            key={user.id.toString()}
            onClick={() => handleUserClick(user)}
            className="group relative bg-white border border-gray-200 p-5 rounded-xl hover:shadow-md hover:border-blue-300 transition-all duration-200 cursor-pointer overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-16 h-16 -mr-8 -mt-8 bg-blue-50 rounded-full group-hover:bg-blue-100 transition-colors" />
            
            <div className="relative flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <PersonIcon />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                  {user.username}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                  <PhoneIcon sx={{ fontSize: 14 }} />
                  <span>{user.mobile}</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full ${
                  user.is_active 
                    ? "bg-green-100 text-green-700" 
                    : "bg-red-100 text-red-700"
                }`}>
                  <CircleIcon sx={{ fontSize: 8 }} />
                  {user.is_active ? t('common.active') || 'Active' : t('common.inactive') || 'Inactive'}
                </span>
                {/* <span className="text-[10px] font-medium text-gray-400">
                  ID: #{user.id.toString()}
                </span> */}
              </div>
            </div>
          </div>
        ))}

        {users.length === 0 && (
          <div className="col-span-full py-12 text-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
            <PersonIcon className="mx-auto text-gray-400 mb-2" fontSize="large" />
            <p className="text-gray-500 font-medium">{t('users.noUsersFound') || 'No users found'}</p>
          </div>
        )}
      </div>

      {showModal && selectedUser && (
        <Modal
          onClose={() => setShowModal(false)}
          isOpen={showModal}
          title={modalTitle}
        >
          <div className="space-y-5 py-4">
            <Input
              label={t("users.firstName")}
              value={selectedUser.username}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, username: e.target.value })
              }
              placeholder="Username"
            />

            <Input
              label={t("users.mobile")}
              value={selectedUser.mobile}
              minLength={11}
              maxLength={11}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, mobile: e.target.value })
              }
              placeholder="01xxxxxxxxx"
            />

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${selectedUser.is_active ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                  <CircleIcon sx={{ fontSize: 16 }} />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{t("users.active")}</p>
                  <p className="text-xs text-gray-500">{selectedUser.is_active ? 'Account is currently active' : 'Account is suspended'}</p>
                </div>
              </div>
              <Switch
                checked={selectedUser?.is_active}
                onChange={handleToggleChange}
                color="primary"
              />
            </div>

            <div className="pt-4 flex gap-3">
              <Button
                fullWidth
                onClick={() => handleUserUpdate(BigInt(selectedUser?.id))}
                isLoading={loading}
              >
                {t("common.update")}
              </Button>
              <Button
                variant="secondary"
                onClick={() => setShowModal(false)}
                disabled={loading}
              >
                {t("common.cancel") || "Cancel"}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

