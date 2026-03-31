import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { userAPI } from "../../api/userAPI";
import { pharmacyAPI } from "../../api/pharmacyAPI";
import { Modal } from "../../components/ui/Modal";
import User from "../../types/user"
import { Pharmacy } from "../../types/pharmacy";

const UsersList: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [pharmacies,setPharamacies] = useState<Pharmacy[]>([]); 
  const [showModal, setShowModal] = useState(false);
  const [pharmacyId,setPharmacyId] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(()=>{
    const getPharmaciesAsync = async() =>{
        const pharmacies = await  pharmacyAPI.getPharmacies()
         setPharamacies(pharmacies)
    }
    getPharmaciesAsync()        
    
  },[])
  
    const fetchUsers = async () => {
        try {
            const response = await userAPI.getUsers(BigInt(pharmacyId));
            setUsers(response);
        }
        catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const handleUserClick = (user: User) => {
        setSelectedUser(user);
        setShowModal(true);
    };

    return (
        <div>
            <h1>Users List</h1>
            <div>
                <label>Select Pharmacy</label>
                <ul>

                </ul>
            </div>
            <button onClick={fetchUsers}>Fetch Users</button>
            <ul>
                {users.map((user: User) => (
                    <li key={user.id} onClick={() => handleUserClick(user)}>
                        {user.username} - {user.email}
                    </li>
                ))}
            </ul>
            {showModal && selectedUser && (
                <Modal onClose={() => setShowModal(false)}>
                    <h2>User Details</h2>
                    <p>Username: {selectedUser.username}</p>
                    <p>Email: {selectedUser.email}</p>
                </Modal>
            )}
        </div>
    );
}