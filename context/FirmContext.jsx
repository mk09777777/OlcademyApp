import { createContext, useContext } from 'react';

export const FirmContext = createContext();

export const useFirm = () => {
  const context = useContext(FirmContext);
  if (!context) {
    throw new Error('useFirm must be used within a FirmProvider');
  }
  return context;
};

export const FirmProvider = ({ children, value }) => {
  return (
    <FirmContext.Provider value={value}>
      {children}
    </FirmContext.Provider>
  );
};