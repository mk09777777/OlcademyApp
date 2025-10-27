import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState, useRef} from "react"

export  const useSafeNavigation = () => {
    const router = useRouter();
    const isNavigatingRef = useRef(false); 
     useFocusEffect(
        useCallback(() => {
            isNavigatingRef.current = false;
        }, [])
    );
    
  const safeNavigation = useCallback((path) =>  {
    if (isNavigatingRef.current) return;

    isNavigatingRef.current = true;

    try {
      router.push(path);
    } catch (error) {
      isNavigatingRef.current = false;
      throw error;
    }

  }, [ router]) ;
  return {safeNavigation};
}