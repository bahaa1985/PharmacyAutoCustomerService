import React, { useEffect, useState } from "react";
import { pharmacyAPI } from "../../api/pharmacyAPI";
import type { Pharmacy } from "../../types/pharmacy";
import { Modal, Switch } from "@mui/material";
import { useToast } from "../../context/ToastContext";
import { useLanguage } from "../../context/LanguageContext";
import { Button } from "../../components/ui/Button";

export const PharmaciesList: React.FC = () => {
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy>();
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const { t } = useLanguage();

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
        work_time:selectedPharmacy?.work_time||"",
        delivery:selectedPharmacy?.delivery,
        logo:selectedPharmacy?.logo||null
      });
      if (updatedPharmacy) {
        showToast(t('pharmacy.updateSuccess'), "success");
        setShowModal(false);
      }
    } catch (error) {
      console.error("Error updating pharmacy:", error);
    } finally {
      setLoading(false);
    }
  };

    return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden`}>
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-800">{t('pharmacy.listHeading')}</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">{t('pharmacy.name')}</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">{t('pharmacy.address')}</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {pharmacies?.map((pharmacy: Pharmacy) => {
              return (
                <tr
                  key={pharmacy.id}
                  className="hover:bg-blue-50/50 transition-colors duration-200 group cursor-pointer"
                  onClick={() => handlePharmacyClick(pharmacy)}
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{pharmacy.pharmacy_name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-600 text-sm">{pharmacy.pharmacy_address}</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      className="text-sm font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:text-blue-800"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePharmacyClick(pharmacy);
                      }}
                    >
                      {t('common.edit') || 'Edit'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {(!pharmacies || pharmacies.length === 0) && (
          <div className="p-8 text-center text-gray-500">
            No pharmacies found.
          </div>
        )}
      </div>
      {showModal && selectedPharmacy && (
        <Modal
          open={showModal}
          onClose={() => setShowModal(false)}
          aria-labelledby="modal-modal-title"
        >
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md p-6 bg-white rounded-xl shadow-2xl focus:outline-none">
            <h2 id="modal-modal-title" className="text-2xl font-bold text-gray-900 mb-6">{modalTitle}</h2>
            <div className="space-y-4 mb-8">
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">{t('pharmacy.name')}</label>
                <input className="w-full p-3 rounded-lg text-gray-900 border border-gray-100" defaultValue={selectedPharmacy.pharmacy_name} onChange={(e)=>selectedPharmacy.pharmacy_name=e.target.value}></input>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">{t('pharmacy.address')}</label>
                <input className="w-full p-3 rounded-lg text-gray-900 border border-gray-100" defaultValue={selectedPharmacy.pharmacy_address} onChange={(e)=>selectedPharmacy.pharmacy_address=e.target.value}></input>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">{t('pharmacy.workTime')}</label>
                <input className="w-full p-3 rounded-lg text-gray-900 border border-gray-100" defaultValue={selectedPharmacy.work_time}onChange={(e)=>selectedPharmacy.work_time=e.target.value}></input>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">{t('pharmacy.delivery')}</label>
                {/* <input className="w-full p-3 rounded-lg text-gray-900 border border-gray-100" value={selectedPharmacy.pharmacy_address}></input> */}
                <Switch color="primary" defaultChecked={selectedPharmacy.delivery} onChange={(e)=>selectedPharmacy.delivery=e.target.checked}></Switch>
              </div>
            </div>
            <div className="pt-4 flex gap-3">              
              <Button
                disabled={loading}
                fullWidth
                // className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm focus:ring-4 focus:ring-blue-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[100px]"
                onClick={() => handlePharmacyUpdate(BigInt(selectedPharmacy.id))}
              >
                {loading ? (
                  <span className="flex items-center space-x-2">
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    <span>{t('users.updating') || 'Updating...'}</span>
                  </span>
                ) : (
                  t('common.update') || 'Update'
                )}
              </Button>
              <Button
                // className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors duration-200"
                variant="secondary"
                onClick={() => setShowModal(false)}
                disabled={loading}
              >
                {t('common.cancel') || 'Cancel'}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
