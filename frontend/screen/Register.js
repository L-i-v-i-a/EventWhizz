import React, { useState, useRef, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Animated, ImageBackground, Alert, ActivityIndicator } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import axios from "axios";

export default function Register({ navigation }) {
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  const [focusedField, setFocusedField] = useState(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isPasswordConfirmVisible, setIsPasswordConfirmVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const contentAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(contentAnimation, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleFocus = (field) => setFocusedField(field);

  const handleBlur = () => setFocusedField(null);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validateField = (field) => {
    const value = form[field] || "";
    if (field === "email") return /\S+@\S+\.\S+/.test(form.email);
    if (field === "password") return form.password.length >= 8;
    if (field === "name") return form.name.length >= 3;
    if (field === "passwordConfirm") return form.passwordConfirm === form.password;
    return value.trim().length > 0;
  };

  const handleRegister = async () => {
    const { name, username, email, password, passwordConfirm } = form;

    if (password.length < 8) {
      return Alert.alert("Error", "Password must be at least 8 characters");
    }

    try {
      setIsLoading(true);

      const response = await axios.post("http://192.168.188.224:7000/auth/signup", {
        name,
        username,
        email,
        password,
        passwordConfirm,
      });

      setIsLoading(false);

      if (response.data.status === "success") {
        navigation.navigate("verify");
      } else {
        Alert.alert("Error", response.data.message || "An error occurred");
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Registration error:", error);

      if (error.response) {
        Alert.alert("Error", error.response.data.message || "Registration failed");
      } else if (error.request) {
        Alert.alert("Error", "Network error, please try again");
      } else {
        Alert.alert("Error", "An unexpected error occurred");
      }
    }
  };

  return (
    <ImageBackground source={require("../assets/background.jpeg")} style={styles.background}>
      <Animated.View
        style={[
          styles.container,
          {
            opacity: contentAnimation,
            transform: [
              {
                translateY: contentAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0],
                }),
              },
            ],
          },
        ]}
      >
        <Text style={styles.title}>Register</Text>
        {["name", "username", "email", "password", "passwordConfirm"].map((field) => (
          <View key={field} style={styles.inputContainer}>
            <Ionicons
              name={field === "email" ? "mail" : field === "password" || field === "passwordConfirm" ? "lock-closed" : "person"}
              size={24}
              color={focusedField === field ? "#6A0DAD" : "#999"}
              style={styles.inputIcon}
            />
            <TextInput
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              placeholderTextColor="#999"
              secureTextEntry={
                (field === "password" && !isPasswordVisible) ||
                (field === "passwordConfirm" && !isPasswordConfirmVisible)
              }
              style={[styles.input, validateField(field) && styles.validInput]}
              onFocus={() => handleFocus(field)}
              onBlur={handleBlur}
              onChangeText={(value) => handleChange(field, value)}
              value={form[field]}
            />
            {(field === "password" || field === "passwordConfirm") && (
              <Ionicons
                name={field === "password" && isPasswordVisible ? "eye" : "eye-off"}
                size={24}
                color="#999"
                style={styles.eyeIcon}
                onPress={() =>
                  field === "password"
                    ? setIsPasswordVisible(!isPasswordVisible)
                    : setIsPasswordConfirmVisible(!isPasswordConfirmVisible)
                }
              />
            )}
          </View>
        ))}

        <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Sign Up</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.footer}>
          Already have an account?{" "}
          <Text style={styles.link} onPress={() => navigation.navigate("login")}>
            Log In
          </Text>
        </Text>
      </Animated.View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 20,
    borderRadius: 10,
    width: "90%",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    color: "#6A0DAD",
    fontWeight: "bold",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#999",
  },
  input: {
    flex: 1,
    fontSize: 16,
    padding: 10,
    color: "#333",
  },
  validInput: {
    borderBottomColor: "#6A0DAD",
  },
  inputIcon: {
    marginRight: 10,
  },
  eyeIcon: {
    marginLeft: 10,
  },
  button: {
    backgroundColor: "#6A0DAD",
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  footer: {
    marginTop: 20,
    fontSize: 14,
    color: "#333",
  },
  link: {
    color: "#6A0DAD",
    fontWeight: "bold",
  },
});
