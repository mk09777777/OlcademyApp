import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState, useRef} from "react"

export  const useSafeNavigation = () => {
    const router = useRouter();
    // const[isNavigating, setIsNavigating] = useState(false);
    const isNavigatingRef = useRef(false); 
     useFocusEffect(
        useCallback(() => {
            isNavigatingRef.current = false;
        }, [])
    );
    
  const safeNavigation = useCallback((path) =>  {
    if(isNavigatingRef.current) return
    isNavigatingRef.current = true;
    router.push(path);

  }, [ router]) ;
  return {safeNavigation};
}