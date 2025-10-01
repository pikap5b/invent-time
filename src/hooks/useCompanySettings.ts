import { useState, useEffect } from 'react';
import { CompanySettings } from '../types';

const defaultCompanySettings: CompanySettings = {
  id: '1',
  name: 'GB PULSE LTD',
  vatNumber: 'CY6013074V',
  address: 'Megalou Theodosiou 23, Block A, Office 303\n4044, Limassol, Germasogeia',
  phone: '+35799941263',
  email: 'Info@xtime-events.com',
  website: 'https://xtime-events.com',
  logo: '',
  bankDetails: {
    bankName: 'Bank of Cyprus',
    accountNumber: '123456789',
    iban: 'CY17 0020 0128 0000 0012 3456 7890',
    swift: 'BCYPCY2N'
  },
  closingMessage: 'Thank you for your business! We appreciate your trust in our services.'
};

export const useCompanySettings = () => {
  const [settings, setSettings] = useState<CompanySettings>(defaultCompanySettings);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedSettings = localStorage.getItem('companySettings');
    if (storedSettings) {
      setSettings(JSON.parse(storedSettings));
    } else {
      localStorage.setItem('companySettings', JSON.stringify(defaultCompanySettings));
    }
    setIsLoading(false);
  }, []);

  const updateSettings = (updates: Partial<CompanySettings>) => {
    const updatedSettings = { ...settings, ...updates };
    setSettings(updatedSettings);
    localStorage.setItem('companySettings', JSON.stringify(updatedSettings));
  };

  const uploadLogo = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const logoDataUrl = e.target?.result as string;
        updateSettings({ logo: logoDataUrl });
        resolve(logoDataUrl);
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };

  return {
    settings,
    isLoading,
    updateSettings,
    uploadLogo,
  };
};