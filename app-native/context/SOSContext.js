import React, { createContext, useContext, useState } from 'react';

const SOSContext = createContext();

export const useSOSContext = () => {
  return useContext(SOSContext);
};

export const SOSProvider = ({ children }) => {
  const [isSOSActive, setIsSOSActive] = useState(false);

  return (
    <SOSContext.Provider value={{ isSOSActive, setIsSOSActive }}>
      {children}
    </SOSContext.Provider>
  );
};
