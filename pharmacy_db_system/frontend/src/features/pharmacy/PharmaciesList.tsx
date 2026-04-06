import React, { useEffect, useState } from "react";
import { pharmacyAPI } from "../../api/pharmacyAPI";
import type { Pharmacy } from "../../types/pharmacy";
import { Modal } from "@mui/material";
import { useToast } from "../../context/ToastContext";

export const PharmaciesList: React.FC = () => {
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy>();
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const fetchPharmacies = async () => {
    try {
      const pharmaciesData = await pharmacyAPI.getPharmacies();
      setPharmacies(pharmaciesData);
    } catch (error) {
      console.error("Error fetching pharmacies:", error);
    }
  };
  useEffect(() => {
    fetchPharmacies();
  }, []);

  const handlePharmacyClick = (pharmacy: Pharmacy) => {
    setSelectedPharmacy(pharmacy);
    setModalTitle(pharmacy.pharmacy_name);
    setShowModal(true);
  };
  const handlePharmacyUpdate = async (pharmacyId: bigint) => {
    setLoading(true);
    try {
      const updatedPharmacy = await pharmacyAPI.updatePharmacy(pharmacyId, {
        pharmacy_name: selectedPharmacy?.pharmacy_name || "",
        pharmacy_address: selectedPharmacy?.pharmacy_address || "",
      });
      if (updatedPharmacy) {
        showToast("Pharmacy updated successfully", "success");
        setShowModal(false);
      }
    } catch (error) {
      console.error("Error updating pharmacy:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Pharmacies List</h2>
      <ul>
        {pharmacies?.map((pharmacy: Pharmacy) => {
          return (
            <li
              key={pharmacy.id}
              className="w-full p-4 my-4 border-b border-b-gray-300"
              onClick={() => handlePharmacyClick(pharmacy)}
            >
              <h3>{pharmacy.pharmacy_name}</h3>
              <p>{pharmacy.pharmacy_address}</p>
            </li>
          );
        })}
      </ul>
      {showModal && selectedPharmacy && (
        <Modal
          open={showModal}
          onClose={() => setShowModal(false)}
          title={modalTitle}
        >
          <div className="w-96 p-4 bg-white rounded-lg shadow-lg">
            <h2>{modalTitle}</h2>
            <p>{selectedPharmacy.pharmacy_name}</p>
            <p>{selectedPharmacy.pharmacy_address}</p>
            <button
              disabled={loading}
              className="w-1/4 h-10 flex justify-center items-center px-4 py-auto bg-green-500 text-[#fff] rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => handlePharmacyUpdate(BigInt(selectedPharmacy.id))}
            >
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};
