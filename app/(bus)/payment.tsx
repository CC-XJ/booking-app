import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useStripe } from "@stripe/stripe-react-native";
import { supabase } from "../../lib/supabase";
import styles from "../../constants/styles/paymentStyles";

export default function PaymentScreen() {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useLocalSearchParams();

  const seatList = (params.seats as string).split(",");
  const amountInCents = seatList.length * 1000;

  const initializePaymentSheet = async () => {
    try {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // 1. Call your Edge Function to get the Client Secret
      const { data, error } = await supabase.functions.invoke(
        "stripe-payment",
        {
          body: {
            amount: amountInCents,
            currency: "myr",
            customerEmail: user?.email,
          },
        }
      );

      // Check if data exists and contains the secret
      if (error || !data?.clientSecret) {
        console.error("Supabase Function Error:", error);
        throw new Error(data?.error || "Failed to initialize payment");
      }

      // 2. Initialize the Stripe Payment Sheet
      const { error: sheetError } = await initPaymentSheet({
        paymentIntentClientSecret: data.clientSecret,
        merchantDisplayName: "Booking App",
        defaultBillingDetails: { email: user?.email },
      });

      if (sheetError) throw sheetError;
    } catch (e) {
      const message =
        e instanceof Error ? e.message : typeof e === "string" ? e : String(e);
      Alert.alert("Error", message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initializePaymentSheet();
  }, []);

  const handlePayPress = async () => {
    const { error } = await presentPaymentSheet();

    if (error) {
      Alert.alert(`Error: " ${error.code}`, error.message);
    } else {
      await finalizeBooking();
    }
  };

  const finalizeBooking = async () => {
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const bookingsToInsert = seatList.map((seat) => ({
        trip_id: params.trip_id,
        seat_number: seat,
        travel_date: params.date,
        user_id: user?.id,
        origin: params.origin,
        destination: params.destination,
        departure: params.departure
      }));

      const { error } = await supabase
        .from("bookings")
        .insert(bookingsToInsert);
      if (error) throw error;

      Alert.alert("Success", "Ticket Booked Successfully!");
      router.push("/(tabs)/booking");
    } catch (e) {
      Alert.alert(
        "Database Error",
        "Payment was successful but booking failed. Contact support."
      );
    } finally {
      console.log("Booking Successful");
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment Summary</Text>
      <View style={styles.box}>
        <Text>Trip ID: {params.trip_id}</Text>
        <Text>Journey: {params.origin} {" -> "} {params.destination} </Text>
        <Text>Seats: {params.seats}</Text>
        <Text style={styles.price}>
          Total: RM{(amountInCents / 100).toFixed(2)}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.payBtn}
        onPress={handlePayPress}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.payBtnText}>Pay Now</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
