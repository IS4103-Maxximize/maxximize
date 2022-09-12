import { View, TouchableOpacity, TextInput, Text, StyleSheet } from 'react-native';
import React, { useRef, useState } from 'react';
import { Input, Button } from "@rneui/themed";


function Login({navigation}) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [organisationCode, setOrganisationCode] = useState('')
    const [error, setError] = useState('')

    async function loginUser(credentials) {
      try {
          const res = await fetch('http://10.0.2.2:3000/api/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
          });
          if (res.status === 201 || res.status === 200) {
            const result = await res.json();
            console.log(result)
            return result;
          } else {
            return null;
          }
      } catch (error) {
        console.log(error)
      }
    }

    const getUserFromJWT = async (accessToken) => {
      try {
        const res = await fetch('http://10.0.2.2:3000/api/profile', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const result = await res.json();
        const { id } = result;
        const userRes = await fetch(
          `http://10.0.2.2:3000/api/users/findUser/${id}`
        );
        const user = await userRes.json();
        return user;
      } catch (error) {
        console.log(error)
      }
    };

    const onSubmit = async () => {
      const result = await loginUser({username, password})
      if (result) {
        const user = await getUserFromJWT(result.access_token)
        if (user.organisation.type === 'retailer' && user.organisation.id === parseInt(organisationCode)) {
          navigation.navigate('Home', {orgId: organisationCode})
        }
      } 
      setError(`You are not a valid user of this organisation with code:${organisationCode}`)
    }
    return (
      <View style={styles.container}>
          <View>
              <Text>Organisation Code</Text>
              <Input onChangeText={(value) => setOrganisationCode(value)}></Input>
          </View>
          <View>
              <Text>Username</Text>
              <Input onChangeText={(value) => setUsername(value)}></Input>
          </View>
          <View>
              <Text>Password</Text>
              <Input onChangeText={(value) => setPassword(value)} secureTextEntry={true}></Input>
          </View>
          <Text style={styles.error}>{error}</Text>
          <Button 
              containerStyle={{
                width: 80,
                marginTop: 10,
                marginLeft: 230
              }} onPress={onSubmit}>Log in</Button>
      </View>
    )
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
    paddingHorizontal: 20
  },
  error: {
    color: 'red'
  }

})

export default Login