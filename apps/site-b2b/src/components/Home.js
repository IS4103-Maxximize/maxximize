import { View, TouchableOpacity, TextInput, Text, StyleSheet } from 'react-native';
import React, { useRef, useState } from 'react';
import { Input, Button } from "@rneui/themed";

function Home() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
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