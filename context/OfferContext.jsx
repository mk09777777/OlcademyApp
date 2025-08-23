import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { API_CONFIG } from '../config/apiConfig';

const OffersContext = createContext();

export const OffersProvider = ({ children }) => {
  const { api} = useAuth();
  const [offers, setOffers] = useState([]);

  const refetchOffers = () => {
    try {
      api
        .get(`/offers`)
        .then((response) => {
          setOffers(response.data);
        });
      console.log(offers);
    } catch (error) {
      console.error("Error fetching Offers:", error);
    }
  };

  // fetch offers on initial mount
  useEffect(() => {
    refetchOffers();
  }, []);

  // Handlers
  const handleAddOffer = async (newOffer) => {
    try {
      // const response = await fetch('http://localhost:5000/offers', {

      const response = await fetch(`${API_CONFIG.BACKEND_URL}/offers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(newOffer),
      });
      const data = await response.json();

      // Ensure offers is updated correctly
      setOffers((prevOffers) => [...prevOffers, data]);

      // Refetch offers from backend (optional)
      refetchOffers();
    } catch (err) {
      console.log("Error while creating new offer", err);
    }
  };

  const handleRemoveOffer = async (offerId) => {
    try {
      // await fetch(`http://localhost:5000/offers/${offerId}`, {
      await fetch(`${API_CONFIG.BACKEND_URL}/delete/offers/${offerId}`, {
        method: "PUT",
      });
      refetchOffers();
    } catch (err) {
      console.log("error while deleting", err);
    }
  };

  const handleEditOffer = async (offerId, updatedFields) => {
    try {
      const res = await fetch(
        `${API_CONFIG.BACKEND_URL}/offers/${offerId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedFields),
          credentials: "include",
        },
        
      );

      await res.json();
      console.log("updated offer");
      refetchOffers();
    } catch (err) {
      console.log("error while: ", err);
    }
  };

  return (
    <OffersContext.Provider
      value={{ offers, handleAddOffer, handleEditOffer, handleRemoveOffer }}
    >
      {children}
    </OffersContext.Provider>
  );
};

// custom hook to use OffersContext
export const useOffers = () => useContext(OffersContext);
