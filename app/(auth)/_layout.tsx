import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Stack } from "expo-router";
import React from "react";

import { useColorScheme } from "@/components/useColorScheme";

export default function LoginLayout() {
  const colorScheme = useColorScheme();

  return (
    <Stack>
      <Stack.Screen
        name="signin"
        options={{
          title: "Sign In",
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="signup"
        options={{
          title: "Sign Up",
        }}
      />
    </Stack>
  );
}
