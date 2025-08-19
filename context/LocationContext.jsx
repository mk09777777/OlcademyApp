import React, { createContext, useContext, useState, useEffect } from 'react';

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState({
    city: '',
    area: '',
    street: '',
    houseNumber: '',
    state: '',
    country: '',
    lat: '',
    lon: '',
    fullAddress: '',
  });
  const [recentlyAdds, setRecentlyAdds] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('http://192.168.0.108:3000/api/location');
        const data = await res.json();

        console.log('Custom API location response:', data);

        const {
          city = '',
          state = '',
          country = '',
          lat = '',
          lon = '',
        } = data;

        const fullAddress = `${city}, ${state}, ${country}`;

        setLocation({
          city,
          state,
          country,
          lat,
          lon,
          fullAddress,
          area: '',
          street: '',
          houseNumber: '',
        });
      } catch (err) {
        console.error('Error fetching location from custom API:', err);
      }
    })();
  }, []);

  return (
    <LocationContext.Provider value={{ location, setLocation, recentlyAdds, setRecentlyAdds }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocationContext = () => useContext(LocationContext);
