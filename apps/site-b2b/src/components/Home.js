import { View, TouchableOpacity, TextInput, Text, StyleSheet } from 'react-native';
import React, { useContext, useRef, useState } from 'react';
import { Input, Button } from "@rneui/themed";
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppContext } from '../App';

function Home({navigation}) {
  const { setAuth } = useContext(AppContext)
  const logout = async() => {
    console.log('logged out!')
    await AsyncStorage.removeItem('user')
    setAuth(null)
    
  }
  const headerRight = () => {
    return (<Button
      onPress={logout}
      title="Logout"
      color="black"
    />)
  }
    useEffect(() => {
      navigation.setOptions({
        headerRight
      })
    }, [])
    return (
      <View style={styles.container}>
          <Text>HOME</Text>
      </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    }
  
})

export default Home