import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { userAPI } from "../../api/userAPI";
import { useAuth } from "../../context/AuthContext";
import { usePharmacy } from "../../context/PharamcyContext";
import { useLanguage } from "../../context/LanguageContext";
import { getRoleTheme } from "../../utils/theme";
import Switch from "@mui/material/Switch";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user, setUser } = useAuth();
  const { pharmacy } = usePharmacy();
  const [isAiMode, setIsAiMode] = useState(user?.ai_mode);
  const [error, setError] = useState("");
  const { t, dir, language, setLanguage } = useLanguage();
  const theme = getRoleTheme(user?.role_id);

  const links = [
    { path: "/dashboard", label: t("layout.dashboard") },
    { path: "/messages", label: t("layout.messages") },
    { path: "/inventory", label: t("layout.inventory") },
    { path:"/pharmacies", label: t("layout.pharmacies")},
    { path: "/users", label: t("layout.users") },
  ];

  const handleToggleAiMode = async () => {
    if (!user) return;
    try {
      const newAiMode = !user.ai_mode;
      setIsAiMode(newAiMode);
      const updatedUser = await userAPI.updateUser(BigInt(user.id), {
        ai_mode: newAiMode,
      });
      setUser({ ...user, ai_mode: updatedUser.ai_mode });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update AI mode");
    }
  };

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

            <aside
        className={`fixed lg:sticky inset-y-0 ${
          dir === "rtl" ? "right-0" : "left-0"
        } w-64 ${theme.sidebar} border-x h-screen lg:h-[calc(100vh-64px)] lg:top-16 flex flex-col z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen
            ? "translate-x-0"
            : dir === "rtl"
              ? "translate-x-full"
              : "-translate-x-full"
        } lg:translate-x-0 shadow-lg lg:shadow-none`}
        dir={dir}
      >
        <div className="p-6 border-b border-gray-100">
          <h1 className={`text-xl font-bold bg-gradient-to-r ${theme.shell} bg-clip-text text-transparent`}>
            {pharmacy?.pharmacy_name}
          </h1>
        </div>
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-1 py-2">
            {links.map((link) => {
              const showLink =
                 (link.path !== "/users" || (user && user.role_id <= 2)) &&
                (link.path !== "/pharmacies" || (user && user.role_id === 1));
              if (!showLink) return null;
              const isActive = location.pathname === link.path;
              return (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    onClick={() => {
                      if (window.innerWidth < 1024) onClose();
                    }}
                    className={`block px-4 py-2.5 rounded-xl transition-all duration-200 font-medium ${
                      isActive
                        ? `${theme.active} shadow-sm`
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="my-4 border-t border-gray-100"></div>
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <span className="text-sm font-medium text-gray-600">
                {isAiMode ? t("layout.aiEnabled") : t("layout.aiDisabled")}
              </span>
              <Switch
                checked={!!user?.ai_mode}
                onChange={handleToggleAiMode}
                size="small"
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: theme.active.split(' ')[1].replace('text-', ''),
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: theme.active.split(' ')[1].replace('text-', ''),
                  },
                }}
              />
            </div>
            <div className="px-2">
              {/* <label className="block text-[10px] text-gray-400 mb-1.5 px-1 uppercase tracking-wider font-bold">
                {language === "ar" ? "اللغة" : "Language"}
              </label> */}
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as "en" | "ar")}
                className={`w-full bg-gray-50 text-gray-700 border border-gray-200 rounded-xl py-2 px-3 focus:outline-none focus:ring-2 ${theme.ring} focus:border-transparent text-sm transition-all`}
              >
                <option value="en">English</option>
                <option value="ar">عربي</option>
              </select>
            </div>
          </div>
        </nav>
      </aside>
    </>
  );
};
