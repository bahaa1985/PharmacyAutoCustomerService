import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { userAPI } from "../../api/userAPI";
import { pharmacyAPI } from "../../api/pharmacyAPI";
import { Modal } from "../../components/ui/Modal";
import type { User } from "../../types/user";
import type { Pharmacy } from "../../types/pharmacy";
// import { Toggle } from "../../components/ui/core/toggle";
import Switch from "@mui/material/Switch"

export const UsersList: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [pharmacies, setPharamacies] = useState<Pharmacy[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [pharmacyId, setPharmacyId] = useState(user?.pharmacy_id || 0);
  const [selectedUser, setSelectedUser] = useState<User>();
  const [isActive,setIsActive] = useState(false)

  useEffect(() => {
    const getPharmaciesAsync = async () => {
      const pharmacies = await pharmacyAPI.getPharmacies();
      setPharamacies(pharmacies);
    };
    if (user?.role_id.toString() === '1') getPharmaciesAsync();
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
    setShowModal(true);
  };

  const handleToggleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
       if (!selectedUser) return;

  setSelectedUser({
    ...selectedUser,
    is_active: e.target.checked,
  });
  }

  const handleUserUpdate = async(userId:bigint) =>{
    try{
      const updatedUser = await userAPI.updateUser(userId,{
        is_active:selectedUser?.is_active,
        username:selectedUser?.username,
        mobile:selectedUser?.mobile,
        role_id:selectedUser?.role_id
      })
      return updatedUser
    }
    catch(error){
      console.error("Error updating user:",error)
    }
  }

  return (
    <div>
      {/* <h1>Users List</h1> */}
      {user?.role_id.toString() === '1' && (
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

      {user?.role_id.toString() === '1' && <button onClick={fetchUsers}>Fetch Users</button>}
      <ul>
        {users.map((user: User) => (
          <li key={user.id} onClick={() => handleUserClick(user)}>
            {user.username} - {user.mobile}
          </li>
        ))}
      </ul>
      {showModal && selectedUser && (
        <Modal onClose={() => setShowModal(false)} isOpen={showModal} title={selectedUser.username}>
          <div>Username: <input type="text" contentEditable={false}>{selectedUser.username}</input></div>
          <p>Mobile: {selectedUser.mobile}</p>
          <label>Active</label>
          {/* <Toggle label="activate_user" checked={selectedUser.is_active} onChange={handleToggleChange} /> */}
<Switch checked={selectedUser?.is_active} onChange={handleToggleChange} />
          <button className="w-1/6 flex p-4 bg-green-600 text-[#fff]" onClick={() => handleUserUpdate(BigInt(selectedUser.id))}>Update</button>
        </Modal>
      )}
    </div>
  );
};
