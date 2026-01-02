import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "../../constants/styles/seatStyles";

export default function SeatSelection() {
  const router = useRouter();

  const [bookedSeats, setBookedSeats] = useState<string[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Input from search
  const { trip_id, date, origin, destination, departure } =
    useLocalSearchParams();

  const input_date = new Date(date as string);
  const selectedDate = input_date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const selectedTime = input_date.toTimeString().split(" ")[0];

  const travelDate = `${selectedDate}  ${selectedTime}`;

  useEffect(() => {
    fetchBookedSeats();
  }, [trip_id, date]);

  const fetchBookedSeats = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("bookings")
        .select("seat_number")
        .eq("trip_id", trip_id)
        .eq("travel_date", date);

      if (error) throw error;

      if (data) {
        setBookedSeats(data.map((b) => b.seat_number));
      }
    } catch (e) {
      console.error("Error fetching seats:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleSeatPress = (seatNum: string) => {
    if (selectedSeats.includes(seatNum)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatNum));
    } else {
      setSelectedSeats([...selectedSeats, seatNum]);
    }
  };

  const renderSeat = (id: number) => {
    const seatLabel = id.toString();
    const isBooked = bookedSeats.includes(seatLabel);
    const isSelected = selectedSeats.includes(seatLabel);

    return (
      <TouchableOpacity
        key={id}
        disabled={isBooked}
        onPress={() => handleSeatPress(seatLabel)}
        style={[
          styles.seat,
          isBooked && styles.bookedSeat,
          isSelected && styles.selectedSeat,
        ]}
      >
        <Ionicons
          name="person"
          size={12}
          color={isBooked ? "#999" : isSelected ? "white" : "#2f95dc"}
        />
        <Text style={[styles.seatText, isSelected && { color: "white" }]}>
          {seatLabel}
        </Text>
      </TouchableOpacity>
    );
  };

  const handleProceed = async () => {
    try {
      setLoading(true);

      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        Alert.alert("Error", "You must be logged in to book a seat.");

        setLoading(false);
        router.push("/(auth)/signin");
      }

      // Prepare data for bulk insert
      const bookingsToInsert = selectedSeats.map((seat) => ({
        trip_id: trip_id,
        seat_number: seat,
        travel_date: date,
        departure: departure,
        origin: origin,
        destination: destination,
        user_id: user?.id,
      }));

      const { error: insertError } = await supabase
        .from("bookings")
        .insert(bookingsToInsert);

      if (insertError) {
        throw error;
      }
      
      router.push({
        pathname: "/(bus)/payment",
        params: {
          trip_id: trip_id,
          seats: selectedSeats.join(","),
          date: date as string,
          departure: departure as string,
          origin: origin as string,
          destination: destination as string,
          amount: (selectedSeats.length * 10).toString(),
        },
      });
    } catch (error: any) {
      console.error("Booking error: ", error);
      Alert.alert("Booking Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" />;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ position: "absolute", left: 16, top: 32 }}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Select Seats</Text>
        <Text style={styles.headerSub}>{`${selectedDate}  ${departure}`}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.busLayout}>
        <View style={styles.steeringWrapper}>
          <Ionicons name="radio-button-off" size={30} color="#ccc" />
          <Text style={{ color: "#ccc", fontSize: 10 }}>Driver</Text>
        </View>

        {Array.from({ length: 10 }).map((_, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            <View style={styles.seatGroup}>
              {renderSeat(rowIndex * 4 + 1)}
              {renderSeat(rowIndex * 4 + 2)}
            </View>
            <View style={styles.aisle} />
            <View style={styles.seatGroup}>
              {renderSeat(rowIndex * 4 + 3)}
              {renderSeat(rowIndex * 4 + 4)}
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <Text>Selected: {selectedSeats.join(", ") || "None"}</Text>
        <TouchableOpacity
          style={[
            styles.btn,
            selectedSeats.length === 0 && { backgroundColor: "#ccc" },
          ]}
          disabled={selectedSeats.length === 0}
          onPress={handleProceed}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={{ color: "white", fontWeight: "bold" }}>
              Proceed to Payment
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
