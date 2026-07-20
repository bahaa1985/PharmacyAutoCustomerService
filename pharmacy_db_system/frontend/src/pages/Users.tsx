import React, { useState } from "react";
import { PageWrapper } from "../components/layout/PageWrapper";
import { NewUser } from "../features/users/NewUser";
import { UsersList } from "../features/users/UsersList";
import { useLanguage } from "../context/LanguageContext";

export const UsersPage: React.FC = () => {
  const { t } = useLanguage();
  const tabs = [
    { label: t("users.listTab"), value: "list" },
    { label: t("users.newTab"), value: "new" },
  ];
  const [selectedTab, setSelectedTab] = useState<"list" | "new">("list");

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              {t("users.title")}
            </h1>
            <p className="text-gray-500 mt-1 text-lg">{t("users.subtitle")}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="border-b border-gray-200 bg-gray-50/50 px-6">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setSelectedTab(tab.value as "list" | "new")}
                  className={`
                    whitespace-nowrap py-4 px-4 border-b-2 font-semibold text-sm transition-all duration-200
                    ${
                      selectedTab === tab.value
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }
                  `}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            <div className="animate-in fade-in duration-500">
              {selectedTab === "list" && <UsersList />}
              {selectedTab === "new" && <NewUser />}
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

