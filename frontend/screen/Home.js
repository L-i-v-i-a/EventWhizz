import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useDispatch } from "react-redux";
import { logout } from "../store/userSlice";
import {useNavigation} from '@react-navigation/native'

const Home = () => {
  const navigation = useNavigation()
  const dispatch = useDispatch();
  const handleLogout = async () => {
    try {
      const response = await fetch("http://192.168.188.224:7000/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (data.status === "success") {
        dispatch(logout());
        navigation.navigate('login'); 
      } else {
        Alert.alert("Error", "Failed to log out. Please try again.");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Error logging out.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: "#6A0DAD",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginTop: 10,
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Home;
