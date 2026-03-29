import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { userAPI } from "../../api/userAPI";
import { Modal } from "../../components/ui/Modal";

const UsersList: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

    const fetchUsers = async () => {
        try {
            const response = await userAPI.getUsers();
            setUsers(response.data);
        }
        catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const handleUserClick = (user: any) => {
        setSelectedUser(user);
        setShowModal(true);
    };

    return (
        <div>
            <h1>Users List</h1>
            <button onClick={fetchUsers}>Fetch Users</button>
            <ul>
                {users.map((user: any) => (
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