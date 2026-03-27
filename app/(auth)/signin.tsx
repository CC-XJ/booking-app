import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import authStyles from "../../constants/styles/authStyles";
import { supabase } from "../../lib/supabase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  async function signIn() {
    if (!email || !password) {
      alert("Please enter both email and password");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password,
    });

    if (error) {
      Alert.alert("Login Failed", error.message);
      console.log(error.message);
      setLoading(false);
      return;
    }

    if (data.session) {
      console.log("Login Successful");
      router.replace("/(tabs)");
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
              <Text style={authStyles.title}>Sign In</Text>

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

              <TouchableOpacity
                style={authStyles.button}
                onPress={signIn}
                disabled={loading}
              >
                <Text style={authStyles.buttonText}>
                  {loading ? "Loading..." : "Sign In"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity>
                <Text
                  onPress={() => router.push("/signup")}
                  style={authStyles.linkText}
                >
                  Don't have an account? Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
