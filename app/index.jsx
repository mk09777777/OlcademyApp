// import { Redirect } from 'expo-router';
// import { useEffect, useState } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// export default function Index() {
//   // const [isAuthenticated, setIsAuthenticated] = useState(null);

//   // useEffect(() => {
//   //   const checkAuth = async () => {
//   //     const token = await AsyncStorage.getItem('authToken');
//   //     setIsAuthenticated(!!token);
//   //   };
//   //   checkAuth();
//   // }, []);

//   // if (isAuthenticated === null) {
//   //   return null; 
//   // }

//   // return isAuthenticated ? 
//     <Redirect href="/home" /> 
// }
import React from 'react'
import { Redirect } from 'expo-router'



export const unstable_settings = {
  initialRouteName: 'auth',
};

export default function index() {

  return (<>
    <Redirect href="auth"/>

    </>
  )
}

