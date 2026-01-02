import React, { useEffect, useState, useCallback } from "react";

import { useFocusEffect } from "expo-router";

import EditScreenInfo from "@/components/EditScreenInfo";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../../lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import styles from "../../constants/styles/bookingStyles";

interface Booking {
  id: string;
  trip_id: string;
  seat_number: string;
  travel_date: string;
  departure: string;
  origin: string;
  destination: string;
  created_at: string;
}

interface GroupedBooking {
  trip_id: string;
  travel_date: string;
  departure: string;
  origin: string;
  destination: string;
  created_at: string;
  seats: string[];
}

export default function BookingScreen() {
  const [bookings, setBookings] = useState<GroupedBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchMyBookings();
    }, [])
  );

  const fetchMyBookings = async () => {
    try {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("user_id", user.id)
        .order("travel_date", { ascending: true })
        .order("departure", {ascending: true});

      if (error) throw error;

      if (data) {
        groupBookings(data);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };
  const groupBookings = (rawData: Booking[]) => {
    const groups: { [key: string]: GroupedBooking } = {};

    rawData.forEach((item) => {
      const key = `${item.trip_id}-${item.travel_date}-${item.created_at}`;

      if (!groups[key]) {
        groups[key] = {
          trip_id: item.trip_id,
          travel_date: item.travel_date,
          departure: item.departure,
          origin: item.origin,
          destination: item.destination,
          created_at: item.created_at,
          seats: [item.seat_number],
        };
      } else {
        groups[key].seats.push(item.seat_number);
      }
    });

    setBookings(Object.values(groups));
  };

  const renderBookingCard = ({ item }: { item: GroupedBooking }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.routeText}>
          {item.origin} {` -> `} {item.destination}
        </Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Confirmed</Text>
        </View>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <Ionicons name="calendar-outline" size={16} color="#666" />
          <Text style={styles.detailText}>
            {new Date(item.travel_date).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="time-outline" size={16} color="#666" />
          <Text style={styles.detailText}>{item.departure.slice(0, 5)}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="apps-outline" size={16} color="#666" />
          <Text style={styles.detailText}>
            Seats: {item.seats.sort().join(", ")}
          </Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.purchaseDate}>
          Booked on: {new Date(item.created_at).toLocaleDateString()}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.screenHeader}>
        <Text style={styles.screenTitle}>My Bookings</Text>
      </View>

      {loading && !refreshing ? (
        <ActivityIndicator size="large" color="#2f95dc" style={{ flex: 1 }} />
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderBookingCard}
          contentContainerStyle={{ padding: 16 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                fetchMyBookings();
              }}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="receipt-outline" size={80} color="#ccc" />
              <Text style={styles.emptyText}>No bookings found yet.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
