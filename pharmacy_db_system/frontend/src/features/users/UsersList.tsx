import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { userAPI } from "../../api/userAPI";
import { pharmacyAPI } from "../../api/pharmacyAPI";
import { Modal } from "../../components/ui/Modal";
import { useToast } from "../../context/ToastContext";
import type { User } from "../../types/user";
import type { Pharmacy } from "../../types/pharmacy";
import Switch from "@mui/material/Switch";

export const UsersList: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
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
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await userAPI.getUsers(BigInt(pharmacyId));
      setUsers(response);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handlePharmacyClick = (pharmacyId: number) => {
    setPharmacyId(pharmacyId);
    fetchUsers();
  };

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
    setModalTitle(user.username + "'s Details");
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
        showToast(`${selectedUser?.username} updated successfully!`, "success");
        setShowModal(false);
        await fetchUsers();
      }
      return updatedUser;
    } catch (error) {
      console.error("Error updating user:", error);
      showToast("Failed to update user", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* <h1>Users List</h1> */}
      {user?.role_id.toString() === "1" && (
        <div>
          <label>Select Pharmacy</label>
          <select
            name="pharmacyId"
            value={pharmacyId}
            onChange={(e) => handlePharmacyClick(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded"
          >
            <option value={0}>Select Pharmacy</option>
            {pharmacies?.map((pharmacy) => (
              <option key={pharmacy.id} value={pharmacy.id}>
                {pharmacy.pharmacy_name}
              </option>
            ))}
          </select>
        </div>
      )}

      {user?.role_id.toString() === "1" && (
        <button onClick={fetchUsers}>Fetch Users</button>
      )}
      <ul>
        {users.map((user: User) => (
          <li
            key={user.id}
            className="my-4 cursor-pointer border-b border-b-gray-300"
            onClick={() => handleUserClick(user)}
          >
            {user.username} - {user.mobile}
          </li>
        ))}
      </ul>
      {showModal && selectedUser && (
        <Modal
          onClose={() => setShowModal(false)}
          isOpen={showModal}
          title={modalTitle}
        >
          <div className="my-4">
            Username:
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded"
              value={selectedUser.username}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, username: e.target.value })
              }
            />
            {/* <button className="cursor-pointer"  onClick={()=>setEditable(true)}><EditIcon fontSize="medium"/></button> */}
          </div>
          <div className="my-4">
            Mobile:
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded"
              value={selectedUser.mobile}
              minLength={11}
              maxLength={11}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, mobile: e.target.value })
              }
            />
          </div>
          <div className="my-4">
            Active:
            <Switch
              checked={selectedUser?.is_active}
              onChange={handleToggleChange}
            />
          </div>
          {/* <label>Active</label> */}
          {/* <Toggle label="activate_user" checked={selectedUser.is_active} onChange={handleToggleChange} /> */}

          <button
            disabled={loading}
            className="w-1/4 h-10 flex justify-center items-center px-4 py-auto bg-green-500 text-[#fff] rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => handleUserUpdate(BigInt(selectedUser?.id))}
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </Modal>
      )}
    </div>
  );
};
