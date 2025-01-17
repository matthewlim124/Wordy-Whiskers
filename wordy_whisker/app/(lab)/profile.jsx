import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ImageBackground,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import cat from "@/assets/images/cat.jpg";

const setItemToAsyncStorage = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    console.error("Error saving data to AsyncStorage", e);
  }
};

const getItemFromAsyncStorage = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value;
  } catch (e) {
    console.log("Error getting data from key");
  }
};

let token = "";
let username = "";

function ProfileScreen() {
  const [newPlayerName, setNewPlayerName] = useState("");
  const [playerId, setPlayerId] = useState("");
  const [playerScore, setPlayerScore] = useState("0");
  const [correctAnswers, setCorrectAnswers] = useState("0");
  const navigation = useNavigation();

  useEffect(() => {
    loadPlayerData();
  }, []);

  const loadPlayerData = async () => {
    try {
      token = await getItemFromAsyncStorage("token");
      const response = await fetch(
        "https://silent-oxide-441601-r2.et.r.appspot.com/api/player/",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setPlayerScore(data[0].score);
        setPlayerId(data[0].player_id);
        setCorrectAnswers(data[0].correct_ans);
      } else {
        handleError("Failed to load player data");
        await refreshToken();
      }
    } catch (err) {
      handleError("Error loading player data", err);
    }
  };

  const handleChangeName = async () => {
    token = await getItemFromAsyncStorage("token");

    if (!newPlayerName) {
      Alert.alert("Please enter a new player name.");
      return;
    }

    try {
      token = await getItemFromAsyncStorage("token");
      const response = await fetch(
        `https://silent-oxide-441601-r2.et.r.appspot.com/api/player/${playerId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            playername: newPlayerName,
            score: playerScore,
            correct_ans: correctAnswers,
          }),
        }
      );
      if (response.ok) {
        Alert.alert("Player name changed successfully!");
        await setItemToAsyncStorage("nameUpdated", "true");
        navigation.navigate("lab");
      } else {
        const error = await response.json();
        console.error("Failed to change player name:", error);
        Alert.alert("Error changing player name. Please try again.");
        await refreshToken();
      }
    } catch (err) {
      console.error("Error changing player name:", err);
      Alert.alert("An error occurred. Please try again.");
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("usr");

      Alert.alert("Logged out successfully!");
      navigation.navigate('index');
    } catch (err) {
      console.error("Error logging out:", err);
      Alert.alert("An error occurred while logging out.");
    }
  };

  const refreshToken = async () => {
    try {
      username = await getItemFromAsyncStorage("usr");
      const response = await fetch(
        "https://silent-oxide-441601-r2.et.r.appspot.com/api/user/refresh",
        {
          method: "POST",
          credentials: "include",
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        await setItemToAsyncStorage("token", data.accessToken);
        Alert.alert("Token refreshed successfully, please try again!");
      } else {
        handleError("Failed to refresh token");
      }
    } catch (err) {
      handleError("Error refreshing token", err);
    }
  };

  return (
    <ImageBackground source={cat} style={styles.backgroundImage}>
      <View style={styles.container}>
        <Text style={styles.title}>Profile</Text>
        <TextInput
          style={styles.input}
          value={newPlayerName}
          onChangeText={setNewPlayerName}
          placeholder="Enter new player name"
          placeholderTextColor="#696969"
        />
        <TouchableOpacity style={styles.button} onPress={handleChangeName}>
          <Text style={styles.buttonText}>Change Name</Text>
        </TouchableOpacity>
        <View style={{ height: 5 }}></View> 
        <TouchableOpacity style={styles.button_logout} onPress={handleLogout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 25,
  },
  title: {
    fontSize: 20,
    
    marginBottom: 20,
    fontFamily: "Press2P", // Added font family
  },
  input: {
    borderWidth: 2,
    borderColor: "#555555",
    padding: 10,
    borderRadius: 5,
    fontSize: 10,
    width: "80%",
    marginBottom: 20,
    fontFamily: "Press2P", // Added font family
  },
  button: {
    backgroundColor: "green",
    padding: 15,
    borderRadius: 5,
    width: "80%",
    alignItems: "center",
    marginBottom: 10,
  },
  button_logout: {
    backgroundColor: "red",
    padding: 15,
    borderRadius: 5,
    width: "80%",
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 8,
    fontFamily: "Press2P", // Added font family
  },
});

export default ProfileScreen;