import React, { useState, useEffect } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { messagesAPI } from "../../api";
import { userAPI } from "../../api/userAPI";
import { inventoryAPI } from "../../api";
import { useAuth } from "../../context/AuthContext";
import { usePharmacy } from "../../context/PharamcyContext";
import { 
  PeopleOutline, 
  MessageOutlined, 
  VaccinesOutlined, 
  QueryStats, 
} from '@mui/icons-material';


interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 dark:bg-slate-900 dark:text-slate-100">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 dark:text-slate-100 text-sm font-medium">{label}</p>
        <p className="text-3xl font-bold text-gray-900 dark:text-slate-100 mt-2">{value}</p>
      </div>
      {icon && (
        <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600">
          {icon}
        </div>
      )}
    </div>
  </div>
);

export const DashboardStats: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { pharmacy } = usePharmacy();
  const [messagesCount, setMessagesCount] = useState<string | number>(0);
  const [inventoryCount, setInventoryCount] = useState<string | number>(0);
  const [usersCount, setUsersCount] = useState<string | number>(0);
  // const [orders,setOrders] = useState(0)

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const messages = await messagesAPI.getMessagesByPharmacy(
          Number(pharmacy?.id),
          user?.mobile,
        );
        if(messages){
          setMessagesCount(messages?.length)
        }
        else {
          setMessagesCount(0)
        }
      } catch {
        setMessagesCount("Not Available now");
      }
    };
const fetchInventory = async () => {
      try {
        const itemsCount = await inventoryAPI.getInventoryCountByPharmacyId(
          Number(pharmacy?.id),
        );
        if(itemsCount) setInventoryCount(itemsCount) 
        else {setInventoryCount(0)}
      } catch {
        setMessagesCount("Not Available now");
      }
    };

    const fetchUsers = async()=>{
      try {
        const users = await userAPI.getUsers(Number(pharmacy?.id))
        setUsersCount(users?.length)
      } catch {
        setUsersCount("Not Available Now")
      }
    }

    fetchMessages();
    fetchInventory();
    fetchUsers();
  }, [pharmacy?.id, user?.mobile]);

  // useEffect(() => {
  //   const fetchInventory = async () => {
  //     try {
  //       const inventoryCount = await inventoryAPI.getInventoryCountByPharmacyId(
  //         Number(pharmacy?.id),
  //       );
  //       setInventoryCount(inventoryCount);
  //     } catch {
  //       setMessagesCount("Not Available now");
  //     }
  //   };

  //   fetchInventory();
  // },[pharmacy?.id]);

  const stats = [
    { label: t("dashboard.stats.messages"), value: messagesCount, icon: <MessageOutlined /> },
    { label: t("dashboard.stats.inventory"), value: inventoryCount, icon: <VaccinesOutlined /> },
    { label: t("dashboard.stats.users"), value: usersCount, icon: <PeopleOutline /> },
    { label: t("dashboard.stats.orders"), value: 57, icon: <QueryStats /> },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  );
};
