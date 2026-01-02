import React, { useState } from "react";
import {
  Alert,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../../lib/supabase";
import authStyles from "../../constants/styles/authStyles";
import { useRouter } from "expo-router";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  async function signUp() {
    // Validation
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password: password,
    });

    if (error) {
      Alert.alert("Registration Failed", error.message);
      console.log(error.message);
      setLoading(false);
      return;
    }

    if (data.session) {
      Alert.alert("Success", "Account created successfully!");
      console.log("Account created Successfully!");
      router.replace("/(tabs)");
    } else {
      Alert.alert(
        "Check your email",
        "Please verify your email before signing in."
      );
      router.push("/signin");
    }

    setLoading(false);
  }

  return (
    <SafeAreaView style={authStyles.mainContainer}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={authStyles.scrollContainer}
            keyboardShouldPersistTaps="handled"
          >
            <View style={authStyles.card}>
              <Text style={authStyles.title}>Create Account</Text>

              <TextInput
                style={authStyles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize={"none"}
                keyboardType="email-address"
              />
              <TextInput
                style={authStyles.input}
                placeholder="Password"
                value={password}
                secureTextEntry={true}
                onChangeText={setPassword}
                autoCapitalize={"none"}
              />
              <TextInput
                style={authStyles.input}
                placeholder="Confirm Password"
                value={confirmPassword}
                secureTextEntry={true}
                onChangeText={setConfirmPassword}
                autoCapitalize={"none"}
              />

              <TouchableOpacity
                style={authStyles.button}
                onPress={signUp}
                disabled={loading}
              >
                <Text style={authStyles.buttonText}>
                  {loading ? "Creating Account..." : "Sign Up"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity>
                <Text
                  onPress={() => router.push("/signin")}
                  style={authStyles.linkText}
                >
                  Already have an account? Sign In
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
