import { View, Text, TextInput, Button, StyleSheet, Alert, ImageBackground, TouchableOpacity} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import React, { useState }from 'react'
import cat from "@/assets/images/cat.jpg"
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getItemFromAsyncStorage = async (key) => {
  try{
    const value = await AsyncStorage.getItem(key);
    return value;
  }catch(e) {
    console.log("Error getting data from key");
  }
};

const SignUpScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const accessToken = await getItemFromAsyncStorage('token');
        if (accessToken) {
          // User is logged in, redirect to 'lab'
          navigation.navigate('(lab)'); // Use navigation.navigate
        } else {
          // User is not logged in, show some content or redirect to login
          // For now, let's just display a message
          <View>
            <Text>User is not logged in</Text>
          </View>
        }
      } catch (error) {
        console.error('Error checking login status:', error);
      }
    };

    checkLoginStatus();
  }, []);

  const handleSignUp = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter both username and password.');
      return;
    }

    try {
      const response = await fetch(
        'https://silent-oxide-441601-r2.et.r.appspot.com/api/user/register',
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
        Alert.alert('Success', `Sign-up successful! ${data.username}`);
        navigation.navigate('signIn'); // Assuming "SignIn" is the name of your sign-in screen.
      } else {
        const error = await response.json();
        Alert.alert('Error', error.message);
      }
    } catch (err) {
      console.error('Sign-up failed:', err);
      Alert.alert('Error', 'An error occurred during sign-up. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={cat} resizeMode='cover' style={styles.image}>
        <Text style={styles.title}>WORDY WHISKERS!</Text>
        <Text style={styles.description}>
          Welcome to Wordy Whiskers, where you can train your english grammar and vocabulary proficiency.
        </Text>
        <View style={styles.signupContainer}>
          <Text style={styles.heading}>Sign Up</Text>
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
          <TouchableOpacity style={styles.button} onPress={handleSignUp}>
            <Text style={styles.buttonText}>Sign Up</Text> 
          </TouchableOpacity>
          <Text style={styles.signInText}>
            Already have an account?{' '}
            <Text style={styles.link} onPress={() => navigation.navigate('signIn')}>
              Sign In
            </Text>
          </Text>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
    
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Press2P',
    textAlign: 'center',
    marginVertical: 20,
    color: '#f2e311',
  },
  image: {
    width: '100%',
    
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  description: {
    fontFamily: 'Press2P',
    textAlign: 'center',
    marginBottom: 20,
  },
  signupContainer: {
    
    padding: 20,
    backgroundColor: 'skyblue',
    borderRadius: 10,
    marginHorizontal: 'auto',
  },
  heading: {
    fontSize: 13,
    
    marginBottom: 10,
    fontFamily: 'Press2P',
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
  signInText: {
    marginTop: 10,
    textAlign: 'center',
    fontFamily: 'Press2P',
    fontSize: 8,
    color: 'white',
  },
  link: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
});


export default SignUpScreen