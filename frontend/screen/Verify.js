import React, { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Animated, Alert, ImageBackground } from "react-native";
import axios from "axios";

export default function Verify({ navigation }) {
  const [otp, setOtp] = useState("");
  const [isResendEnabled, setIsResendEnabled] = useState(false);
  const [timer, setTimer] = useState(30);
  const contentAnimation = useRef(new Animated.Value(0)).current;
  const inputs = useRef([]);

  useEffect(() => {
    Animated.timing(contentAnimation, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    } else {
      setIsResendEnabled(true);
    }
  }, [timer]);

  const handleCodeChange = (value, index) => {
    const newCode = otp.split("");
    newCode[index] = value.replace(/[^0-9]/g, "");
    setOtp(newCode.join(""));

    if (value && index < 3) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyPress = (key, index) => {
    if (key === "Backspace" && index > 0 && !otp[index]) {
      inputs.current[index - 1].focus();
    }
  };

  const handleVerify = async () => {
    if (otp.length !== 4) {
      Alert.alert("Error", "Please enter a valid 4-digit code.");
      return;
    }

    try {
      const response = await axios.post("http://192.168.188.224:7000/auth/verify", {
        otp,
      });

      if (response.status === 200) {
        Alert.alert("Success", "Verification successful!");
        navigation.navigate("login");
      } else {
        Alert.alert("Error", response.data.message || "Verification failed. Please try again.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "An error occurred while verifying the code."
      );
    }
  };

  const handleResendCode = async () => {
    setIsResendEnabled(false);
    setTimer(30);

    try {
      const response = await axios.post("http://192.168.188.224:7000/auth/resend");

      if (response.status === 200) {
        Alert.alert("Info", "Verification code has been resent.");
      } else {
        Alert.alert("Error", response.data.message || "Failed to resend code. Please try again.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "An error occurred while resending the code."
      );
    }
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
          <Text style={styles.title}>Verify Your Account</Text>
          <Text style={styles.paragraph}>
            Please enter the 4-digit code sent to your email address. If you did not receive the code, you can{" "}
            <Text style={styles.link} onPress={() => navigation.navigate("register")}>
              go back to register
            </Text>{" "}
            or resend the code.
          </Text>

          <View style={styles.codeContainer}>
            {[...Array(4)].map((_, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputs.current[index] = ref)}
                style={styles.codeInput}
                keyboardType="numeric"
                maxLength={1}
                value={otp[index] || ""}
                onChangeText={(value) => handleCodeChange(value, index)}
                onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
              />
            ))}
          </View>

          <TouchableOpacity style={styles.button} onPress={handleVerify}>
            <Text style={styles.buttonText}>Verify</Text>
          </TouchableOpacity>

          {isResendEnabled ? (
            <TouchableOpacity onPress={handleResendCode}>
              <Text style={styles.link}>Resend Code</Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.timer}>Resend available in {timer}s</Text>
          )}
        </Animated.View>
      </View>
    </ImageBackground>
  );
}

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
    fontSize: 24,
    fontWeight: "bold",
    color: "#6A0DAD",
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
  },
  link: {
    color: "#6A0DAD",
    fontWeight: "bold",
  },
  codeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  codeInput: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    textAlign: "center",
    fontSize: 18,
    backgroundColor: "#f9f9f9",
    marginHorizontal: 5,
  },
  button: {
    backgroundColor: "#6A0DAD",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  timer: {
    fontSize: 14,
    color: "#999",
    marginTop: 20,
  },
});
