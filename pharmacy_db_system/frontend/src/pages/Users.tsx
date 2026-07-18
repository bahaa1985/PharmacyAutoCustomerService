import React, { useState } from "react";
import { PageWrapper } from "../components/layout/PageWrapper";
import { NewUser } from "../features/users/NewUser";
import { UsersList } from "../features/users/UsersList";
import { useLanguage } from "../context/LanguageContext";

export const UsersPage: React.FC = () => {
  const { t } = useLanguage();
  const tabs = [
    { label: t('users.listTab'), value: "list" },
    { label: t('users.newTab'), value: "new" },
  ];
  const [selectedTab, setSelectedTab] = useState<"list" | "new">("list");

  return (
    <PageWrapper>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">{t('users.title')}</h1>
          <p className="text-gray-600 mt-2">{t('users.subtitle')}</p>
          <div className="mt-4">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                {tabs.map((tab) => (
                  <button
                    key={tab.value}
                    onClick={() => setSelectedTab(tab.value as "list" | "new")}
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                      selectedTab === tab.value
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>
          {selectedTab === "list" && <UsersList />}
          {selectedTab === "new" && <NewUser />}
        </div>
      </div>
    </PageWrapper>
  );
};
