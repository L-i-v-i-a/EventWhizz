import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ImageBackground,
  Animated,
  Icon,
} from "react-native";
import { useDispatch } from "react-redux";
import { login } from "../store/userSlice";

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const dispatch = useDispatch();

  const contentAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(contentAnimation, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleLogin = async () => {
    try {
      const response = await fetch("http://192.168.188.224:7000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (data.status === "success") {
        dispatch(
          login({
            userDetails: data.data.user,
            token: data.token,
          })
        );
        navigation.navigate("profile");
      } else {
        Alert.alert("Error", "Invalid login credentials");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Error logging in");
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate("forgotPassword");
  };

  return (
    <ImageBackground
      source={require("../assets/background.jpeg")}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.content,
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
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Log in to continue</Text>

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#aaa"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#aaa"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!passwordVisible}
            />
            <TouchableOpacity
              onPress={() => setPasswordVisible((prevState) => !prevState)}
              style={styles.eyeIcon}
            >
              <Text style={styles.eyeIconText}>
                {passwordVisible ? "Hide" : "Show"}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={handleForgotPassword}>
            <Text style={styles.forgotPasswordLink}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("register")}>
            <Text style={styles.link}>
              Don't have an account?{" "}
              <Text style={styles.linkHighlight}>Register</Text>
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    width: "90%",
    alignItems: "center",
    padding: 20,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#6A0DAD",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    paddingHorizontal: 15,
    marginBottom: 15,
    color: "#333",
  },
  passwordContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  eyeIcon: {
    position: "absolute",
    right: 15,
  },
  eyeIconText: {
    color: "#6A0DAD",
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#6A0DAD",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginTop: 10,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  forgotPasswordLink: {
    color: "#6A0DAD",
    alignSelf: "flex-end",
    marginVertical: 10,
    fontSize: 14,
    fontWeight: "bold",
  },
  link: {
    color: "#555",
    marginTop: 20,
    fontSize: 14,
  },
  linkHighlight: {
    color: "#6A0DAD",
    fontWeight: "bold",
  },
});

export default Login;
