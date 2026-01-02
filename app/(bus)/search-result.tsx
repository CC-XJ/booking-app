import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "../../constants/styles/resultStyles";

interface Trip {
  trip_id: string;
  origin_name: string;
  destination_name: string;
  departure: string;
  arrival: string;
  service_id: string;
}

export default function SearchResult() {
  const router = useRouter();

  // Input from search
  const { originStopId, destinationStopId, date } = useLocalSearchParams();

  const input_date = new Date(date as string);
  const selectedDate = input_date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const selectedTime = input_date.toTimeString().split(" ")[0];

  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrips();
  }, [originStopId, destinationStopId]);

  const fetchTrips = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase.rpc("get_trip_schedule", {
        input_origin_id: originStopId,
        input_dest_id: destinationStopId,
        input_time: selectedTime,
      });

      if (error) {
        console.log("Error:", error);
        throw error;
      }

      setTrips(data || []);
      console.log(`Trips successfully fetched, ${data.length} trips found.`);
    } catch (error) {
      console.error("Error fetching trip: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTrip = (trip: Trip) => {
    try {
      if (!trip) {
        console.log("No trip found");
        return;
      }
      
      router.push({
        pathname: "/(bus)/seat-selection",
        params: {
          trip_id: trip.trip_id,
          origin: trip.origin_name,
          destination: trip.destination_name,
          departure: trip.departure,
          arrival: trip.departure,
          date: date,
        },
      });

      console.log("Routing to seat selection");

    } catch (error) {
      console.log("Error:", error);
    }
  };

  const renderItem = ({ item }: { item: Trip }) => (
    <TouchableOpacity
      style={styles.busCard}
      onPress={() => handleSelectTrip(item)}
    >
      <View>
        <Text style={styles.operatorText}>Service - {item.service_id}</Text>
        <Text style={styles.busType}>Trip ID: {item.trip_id}</Text>

        <View
          style={{ flexDirection: "row", alignItems: "center", marginTop: 8 }}
        >
          <Ionicons name="time-outline" size={16} color="#2f95dc" />
          <Text style={styles.timeText}>
            {item.departure.slice(0, 5)} → {item.arrival.slice(0, 5)}
          </Text>
        </View>
      </View>

      <View style={styles.priceContainer}>
        <Text style={styles.priceText}>Available</Text>
        <Ionicons name="chevron-forward" size={20} color="#ccc" />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Info Bar */}
      <View style={styles.infoBar}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ position: "absolute", left: 16, top: 32 }}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

        <Text style={styles.routeText}>
          {trips.length > 0
            ? `${trips[0].origin_name} to ${trips[0].destination_name}`
            : "Searching Route..."}
        </Text>
        <Text style={styles.dateText}>{selectedDate}</Text>
        <Text style={styles.dateText}>{selectedTime}</Text>
      </View>

      {loading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#2f95dc" />
          <Text style={{ marginTop: 10, color: "gray" }}>
            Finding available trips...
          </Text>
        </View>
      ) : (
        <FlatList
          data={trips}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16 }}
          ListEmptyComponent={
            <View style={{ alignItems: "center", marginTop: 50 }}>
              <Ionicons name="bus-outline" size={64} color="#ccc" />
              <Text style={{ color: "gray", marginTop: 16 }}>
                No trips found for this time.
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
