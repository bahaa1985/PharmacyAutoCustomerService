import React, {useState} from 'react'
import { PageWrapper } from '../components/layout/PageWrapper';
import { NewPharmacy} from '../features/pharmacy/NewPharmacy';
import { PharmaciesList } from '../features/pharmacy/PharmaciesList';
import { useLanguage } from '../context/LanguageContext';
export const PharmacyPage: React.FC=()=>{
    const { t } = useLanguage();
    const tabs = [
    { label: t('pharmacy.listTab'), value: 'list' },
    { label: t('pharmacy.newTab'), value: 'new' },
  ];    
    const [selectedTab, setSelectedTab] = useState<'list' | 'new'>('new');
        return (
        <PageWrapper>
        <div className="space-y-8">
        <div>
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">{t('pharmacy.title')}</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-2 max-w-2xl">{t('pharmacy.subtitle')}</p>
                        <div className="mt-6 sm:mt-8">
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8 overflow-x-auto overflow-y-hidden" aria-label="Tabs">
                {tabs.map((tab) => (
                    <button
                    key={tab.value}
                    onClick={() => setSelectedTab(tab.value as 'list' | 'new')}
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                        selectedTab === tab.value
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'
                    }`}
                    >
                    {tab.label}
                    </button>
                ))}
                </nav>
            </div>
            </div>
            <div className="mt-8">
                {selectedTab === 'list' && <PharmaciesList/>}
                {selectedTab === 'new' && <NewPharmacy />}
            </div>
        </div>
        </div>
        </PageWrapper>
    )
}