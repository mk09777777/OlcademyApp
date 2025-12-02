import { useState, useCallback } from 'react';

export const useErrorHandler = () => {
  const [error, setError] = useState(null);
  const [isRetrying, setIsRetrying] = useState(false);

  const handleError = useCallback((error, customMessage = null) => {
    console.error('Error occurred:', error);
    
    let errorMessage = customMessage;
    
    if (!errorMessage) {
      if (error?.response?.status === 404) {
        errorMessage = 'Data not found';
      } else if (error?.response?.status === 500) {
        errorMessage = 'Server error. Please try again later';
      } else if (error?.response?.status === 401) {
        errorMessage = 'Authentication required';
      } else if (error?.code === 'NETWORK_ERROR' || error?.message?.includes('Network')) {
        errorMessage = 'Network connection error. Please check your internet';
      } else if (error?.message) {
        errorMessage = error.message;
      } else {
        errorMessage = 'Something went wrong. Please try again';
      }
    }
    
    setError(errorMessage);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const retry = useCallback(async (retryFunction) => {
    if (!retryFunction) return;
    
    setIsRetrying(true);
    setError(null);
    
    try {
      await retryFunction();
    } catch (error) {
      handleError(error);
    } finally {
      setIsRetrying(false);
    }
  }, [handleError]);

  return {
    error,
    isRetrying,
    handleError,
    clearError,
    retry
  };
};

export default useErrorHandler;