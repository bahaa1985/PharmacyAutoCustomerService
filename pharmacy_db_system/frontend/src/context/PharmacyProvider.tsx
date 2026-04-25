import React , {useState, useEffect} from 'react';
import { PharmacyContext } from './PharamcyContext';
import type { Pharmacy } from '../types/pharmacy';
import { pharmacyAPI } from '../api/pharmacyAPI';
import { useAuth } from './AuthContext';

export const PharmacyProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [pharmacy, setPharmacy] = useState<Pharmacy | null>(null);
    const user = useAuth().user
    // const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPharmacy = async (pharmacyId:number) => {
            try {
                const data = await pharmacyAPI.getPharmacyById(pharmacyId); // Assuming pharmacy ID is 1 for now
                setPharmacy(data);
                console.log("pharmacy from provider",data);
                
                // setIsLoading(true)
            } catch {
                setPharmacy(null);
            } finally {
                // setIsLoading(false);
            }
        };
        fetchPharmacy(user?.pharmacy_id || 0);
    }, [user?.pharmacy_id]);

    

    return (
        <PharmacyContext.Provider value={{ pharmacy, setPharmacy}}>
            {children}
        </PharmacyContext.Provider>
    );
}
