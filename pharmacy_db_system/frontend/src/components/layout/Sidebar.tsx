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
        } w-64 bg-gray-900 text-white h-screen lg:h-[calc(100vh-64px)] lg:top-16 flex flex-col z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen
            ? "translate-x-0"
            : dir === "rtl"
              ? "translate-x-full"
              : "-translate-x-full"
        } lg:translate-x-0`}
        dir={dir}
      >
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-2xl font-bold">{pharmacy?.pharmacy_name}</h1>
        </div>
        <nav className="flex-1 p-6">
          <ul className="space-y-2 py-2">
            {links.map((link) => {
              const showLink =
                link.path !== "/users" || (user && user.role_id <= 2);
              if (!showLink) return null;
              return (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    onClick={() => {
                      if (window.innerWidth < 1024) onClose();
                    }}
                    className={`block px-4 py-2 rounded-md transition-colors ${
                      location.pathname === link.path
                        ? "bg-blue-600 text-white"
                        : "text-gray-300 hover:bg-gray-800"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <hr className="border-slate-600"></hr>
          <div className="py-2">
            <div className="flex items-center">
              <Switch
                checked={user?.ai_mode}
                onChange={handleToggleAiMode}
                className="py-1"
              ></Switch>
              <span className="text-gray-300">
                {isAiMode ? t("layout.aiEnabled") : t("layout.aiDisabled")}
              </span>
            </div>
            <div className="mt-4 px-2">
              <label className="block text-xs text-gray-500 mb-1 px-2 uppercase font-bold">
                {language === "ar" ? "اللغة" : "Language"}
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as "en" | "ar")}
                className="w-full bg-gray-800 text-gray-300 border border-gray-700 rounded-md py-1 px-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
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
