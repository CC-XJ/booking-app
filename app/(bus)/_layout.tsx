import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Stack } from "expo-router";
import React from "react";

import { useColorScheme } from "@/components/useColorScheme";
import { StackScreen } from "react-native-screens";

export default function BusLayout() {
  const colorScheme = useColorScheme();

  return (
    <Stack>
      <Stack.Screen
        name="search-result"
        options={{
          title: "Results",
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="seat-selection"
        options={{
          title: "Select Seats",
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="payment"
        options={{
          title: "Payment",
          headerShown: false,
        }}
      />
    </Stack>
  );
}
