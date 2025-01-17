import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ImageBackground, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import cat from "@/assets/images/cat.jpg"

import AsyncStorage from '@react-native-async-storage/async-storage';

const setItemToAsyncStorage = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, value);
    } catch (e) {
        console.error('Error saving data to AsyncStorage', e);
    }
};


const SignInScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();


  const handleSignIn = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter both username and password.');
      return;
    }

    try {
      const response = await fetch(
        'https://silent-oxide-441601-r2.et.r.appspot.com/api/user/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        Alert.alert('Success', `Welcome back, ${data.username}!`);
        await setItemToAsyncStorage('token', data.accessToken);
        await setItemToAsyncStorage('usr', data.username);
        navigation.navigate('(lab)'); // Navigate to the main page after sign-in
      } else {
        const error = await response.json();
        Alert.alert('Error', error.message);
      }
    } catch (err) {
      console.error('Sign-in failed:', err);
      Alert.alert('Error', 'An error occurred during sign-in. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={cat} resizeMode='cover' style={styles.image}>
        <View style={styles.signinContainer}>
          <Text style={styles.heading}>Sign In</Text>
          <Text style={styles.description}>Enter your credentials</Text>
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#696969"
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#696969"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TouchableOpacity style={styles.button} onPress={handleSignIn}>
            <Text style={styles.buttonText}>Sign In</Text> 
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection:'column',
    backgroundColor: '#fff',
    
  },
  image: {
    width: '100%',
    
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  signinContainer: {
    padding: 20,
    backgroundColor: 'skyblue',
    borderRadius: 10,
    marginHorizontal: 'auto',
    
  },
  heading: {
    fontSize: 13,
    fontFamily: 'Press2P',
    marginBottom: 20,
    textAlign: 'center',
    color: 'white',
  },
  input: {
    borderWidth: 2,
    borderColor: '#555555',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    fontFamily: 'Press2P',
    fontSize: 8,
  },
  button: {
    backgroundColor: '#32CD32',
    padding: 12,
    borderRadius: 5,
    justifyContent: 'center',
  },
  buttonText: {  // Style for the text inside the button
    fontFamily: 'Press2P',
    fontSize: 10,
    color: 'white',
    textAlign: 'center',
  },
  description: {
    fontFamily: 'Press2P',
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 10,
    color: 'white',
  },
});

export default SignInScreen;
