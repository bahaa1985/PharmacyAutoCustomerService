import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { userAPI } from "../../api/userAPI";
import { pharmacyAPI } from "../../api/pharmacyAPI";
import { Modal } from "../../components/ui/Modal";
import type { User } from "../../types/user";
import type { Pharmacy } from "../../types/pharmacy";

export const UsersList: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [pharmacies, setPharamacies] = useState<Pharmacy[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [pharmacyId, setPharmacyId] = useState(user?.pharmacy_id || 0);
  const [selectedUser, setSelectedUser] = useState<User>();

  useEffect(() => {
    const getPharmaciesAsync = async () => {
      const pharmacies = await pharmacyAPI.getPharmacies();
      setPharamacies(pharmacies);
    };
    if (user?.role_id === Number(1)) getPharmaciesAsync();
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

  return (
    <div>
      <h1>Users List</h1>
      {user?.role_id === Number(1) && (
        <div>
          <label>Select Pharmacy</label>
          <ul defaultValue={pharmacyId}>
            {pharmacies?.map((pharmacy: Pharmacy) => {
              return (
                <li
                  key={pharmacy.id}
                  onClick={() => handlePharmacyClick(Number(pharmacy.id))}
                >
                  {pharmacy.name}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <button onClick={fetchUsers}>Fetch Users</button>
      <ul>
        {users.map((user: User) => (
          <li key={user.id} onClick={() => handleUserClick(user)}>
            {user.username} - {user.mobile}
          </li>
        ))}
      </ul>
      {showModal && selectedUser && (
        <Modal onClose={() => setShowModal(false)} isOpen={showModal} title={selectedUser.username}>
          <h2>User Details</h2>
          <p>Username: {selectedUser.username}</p>
          <p>Mobile: {selectedUser.mobile}</p>
        </Modal>
      )}
    </div>
  );
};
