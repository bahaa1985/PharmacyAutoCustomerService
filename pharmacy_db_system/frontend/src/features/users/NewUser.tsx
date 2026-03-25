import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {userAPI} from '../../api/userAPI'
import { Modal } from '../../components/ui/Modal';

export const NewUser: React.FC = () => {

    const cuurentUser = useAuth().user

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        mobile: '',
        password: '',
        confirmPassword: '',
        roleId: 1,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [error, setError] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        try{
e.preventDefault();
        const newErrors: Record<string, string> = {};

        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        // if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.mobile.trim()) newErrors.email = 'Email is required';
        if (!formData.password) newErrors.password = 'Password is required';
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            console.log('Form submitted:', formData);
            // TODO: API call to register user
            await userAPI.register({
                mobile:formData.mobile,
                password:formData.password,
                username:formData.firstName,
                role_id:formData.roleId,
                pharmacy_id:cuurentUser?.pharmacy_id || 0
            })
            setShowSuccessModal(true);
        }
        }
        catch(err){
            const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
        }
        
    };

    return (
        <div className="max-w-md mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6">Register New User</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">First Name</label>
                    <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                    />
                    {errors.firstName && (
                        <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Last Name</label>
                    <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                    />
                    {errors.lastName && (
                        <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                        type="number"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                    />
                    {errors.mobile && (
                        <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                    />
                    {errors.password && (
                        <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">
                        Confirm Password
                    </label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                    />
                    {errors.confirmPassword && (
                        <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Role</label>
                    <select
                        name="role"
                        value={formData.roleId}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                    >
                        <option value={2}>Owner</option>
                        <option value={3}>Pharmacist</option>
                        <option value={4}>Delivery</option>
                    </select>
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700"
                >
                    Register
                </button>
            </form>

            <Modal
                isOpen={showSuccessModal}
                title="Registration Successful"
                onClose={() => setShowSuccessModal(false)}
                confirmText="OK"
                onConfirm={() => setShowSuccessModal(false)}
            >
                <p>User has been registered successfully!</p>
            </Modal>
        </div>
    );
};