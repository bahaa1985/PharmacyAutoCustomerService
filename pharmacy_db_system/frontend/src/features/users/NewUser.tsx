import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { userAPI } from "../../api/userAPI";
import { Modal } from "../../components/ui/Modal";
import { pharmacyAPI } from "../../api/pharmacyAPI";
import type{ Pharmacy } from "../../types/pharmacy";

export const NewUser: React.FC = () => {
  const currentUser = useAuth().user;
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    roleId: 2,
  });

  const [pharmacies,setPharamacies] = useState<Pharmacy[]>([]); 
  const [pharmacyId,setPharmacyId] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

   useEffect(()=>{
    
      const getPharmaciesAsync = async() =>{        
          const pharmacies = await  pharmacyAPI.getPharmacies()
           setPharamacies(pharmacies)
      }
      if (currentUser?.role_id.toString() === '1') {
        getPharmaciesAsync()
      }
    },[])


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      const newErrors: Record<string, string> = {};
      if (!formData.firstName.trim())
        newErrors.firstName = "First name is required";
      // if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!formData.mobile.trim()) newErrors.mobile = "Mobile is required";
      if( formData.mobile.length != 13) newErrors.mobile = "Mobile must be 11 digits";
      if (!formData.password) newErrors.password = "Password is required";
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }

      setErrors(newErrors);

      if (Object.keys(newErrors).length === 0) {
        console.log("Form submitted:", formData);
        // TODO: API call to register user
        await userAPI.register({
          mobile: formData.mobile,
          password: formData.password,
          username: formData.firstName,
          role_id: formData.roleId,
          pharmacy_id: currentUser?.role_id.toString() === '1' ? pharmacyId : currentUser?.pharmacy_id || 0,
        });
        setMessage("User registered successfully!");
        setShowSuccessModal(true);
        setFormData({
          firstName: "",
          lastName: "",
          mobile: "",
          password: "",
          confirmPassword: "",
          roleId: 2,
        });
      }
    } catch (err) {
      const errMessage = err instanceof Error ? err.message : "Registration failed";
      setMessage(errMessage);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Register New User</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {
          currentUser?.role_id.toString() === '1' ? (
            <div>
          <label className="block text-sm font-medium mb-1">Pharmacy</label>
          <select
            name="pharmacyId"
            value={pharmacyId}
            onChange={(e) => setPharmacyId(Number(e.target.value))}
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
          ):null
        }
        
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
          <label className="block text-sm font-medium mb-1">Mobile</label>
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
            <p className="text-red-500 text-sm mt-1">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Role</label>
          <select
            name="roleId"
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
