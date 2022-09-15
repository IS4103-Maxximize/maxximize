/* eslint-disable jsx-a11y/accessible-emoji */
import React, { createContext, useMemo, useRef, useState } from 'react';
import {
  View,
  Text
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Login from './components/Login'
import Home from './components/Home'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';

const Stack = createNativeStackNavigator()

export const AppContext = createContext()

export const App = () => {
  const [ auth, setAuth ] = useState(null)

  const appContextValue = useMemo(
    () => ({
      auth,
      setAuth,
    }),
    [auth]
  )
  useEffect(() => {
    const checkAuth = async() => {
      setAuth(await retrieveUser())
    }
    checkAuth()
  }, [])
  const retrieveUser = async() => {
    const user = await AsyncStorage.getItem('user')
    const jsonUser = user ? JSON.parse(user) : null
    return jsonUser
  }

  return (
    <AppContext.Provider value={appContextValue}>
      <NavigationContainer>
        <Stack.Navigator>
          {!auth ? 
          <>
            <Stack.Screen name="login" component={Login} options={{ title: 'MaxxiMize', headerStyle: {
            backgroundColor: '#007fb5' }, headerTintColor: '#fff', headerTitleStyle: { fontWeight: 'bold'}
            } }></Stack.Screen>
          </>
          : 
          <>
            <Stack.Screen name="Home" component={Home} options={({route}) => ({ title: route.params?.orgName, headerStyle: {
            backgroundColor: '#007fb5'
          }, headerTintColor: '#fff', headerTitleStyle: { fontWeight: 'bold' }, headerTitleAlign: 'center'})}></Stack.Screen>
          </>}
        </Stack.Navigator>
      </NavigationContainer>
    </AppContext.Provider>
  )
}

export default App;
