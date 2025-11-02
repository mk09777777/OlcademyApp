import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useRef } from "react";

export const useSafeNavigation = () => {
  const router = useRouter();
  const isNavigatingRef = useRef(false);

  useFocusEffect(
    useCallback(() => {
      isNavigatingRef.current = false;
    }, [])
  );

  const safeNavigation = useCallback(
    async (path) => {
      if (isNavigatingRef.current) return;
      isNavigatingRef.current = true;

      try {
        // ✅ Use navigate instead of push
        router.navigate(path);
      } catch (error) {
        console.error("Navigation failed:", error);
      } finally {
        setTimeout(() => {
          isNavigatingRef.current = false;
        }, 800);
      }
    },
    [router]
  );

  return { safeNavigation };
};
