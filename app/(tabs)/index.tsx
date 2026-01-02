import { Text, View } from "@/components/Themed";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import { supabase } from "../../lib/supabase";
import React, { useCallback, useState, useEffect } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { homeStyles as styles } from "../../constants/styles/homeStyles";

export default function Homepage() {
  const router = useRouter();

  const [stops, setStops] = useState<{ stop_id: string; stop_name: string }[]>([]);
  const [activeRouteId, setActiveRouteId] = useState<string | null>(null);

  const [origin, setOrigin] = useState("");
  const [originId, setOriginId] = useState<string | null>(null);
  const [showOriginList, setShowOriginList] = useState(false);

  const [destination, setDestination] = useState("");
  const [destinationId, setDestinationId] = useState<string | null>(null);
  const [showDestinationList, setShowDestinationList] = useState(false);

  // Date & Time States
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState<"date" | "time">("date");

  useEffect(() => {
    const fetchAllStops = async () => {
      const { data, error } = await supabase.from("stops").select("stop_id, stop_name");
      if (!error && data) {
        setStops(data);
      }
    };
    fetchAllStops();
  }, []);

  const filteredOriginStops = stops.filter((stop) =>
    stop.stop_name.toLowerCase().includes(origin.toLowerCase())
  );

  const filteredDestinationStops = stops
    .filter((stop) => stop.stop_id !== originId)
    .filter((stop) => stop.stop_name.toLowerCase().includes(destination.toLowerCase()));

  const resolveRouteFromStop = async (stopId: string) => {
    const { data, error } = await supabase.rpc("get_routes_by_stop", { p_stop_id: stopId });
    if (error || !data?.length) return null;
    return data[0].route_id;
  };

  const handleSwap = useCallback(() => {
    const tempO = origin;
    const tempOId = originId;
    setOrigin(destination);
    setOriginId(destinationId);
    setDestination(tempO);
    setDestinationId(tempOId);
  }, [origin, destination, originId, destinationId]);

  // Combined Date/Time Change Handler
  const onDateTimeChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    // Android: Close picker immediately after selection
    if (Platform.OS === "android") {
      setShowPicker(false);
    }
    
    if (event.type === "set" && selectedDate) {
      setDate(selectedDate);
    } else if (event.type === "dismissed") {
      setShowPicker(false);
    }
  };

  const showMode = (mode: "date" | "time") => {
    setPickerMode(mode);
    setShowPicker(true);
  };

  const formatDate = (d: Date) => {
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  };

  const formatTime = (d: Date) => {
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
  };

  const handleSearch = useCallback(() => {
    if (!originId || !destinationId) {
      Alert.alert("Missing Information", "Please enter both origin and destination");
      return;
    }

    console.log(`Searching train: ${origin} to ${destination} on ${date} ${formatTime(date)}`)

    router.push({
      pathname: "/(bus)/search-result",
      params: {
        originStopId: originId,
        destinationStopId: destinationId,
        date: date.toISOString(),
        time: formatTime(date)
      },
    });
  }, [originId, destinationId, date]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
            <View style={styles.header}>
              <Text style={styles.greeting}>Where are you headed?</Text>
            </View>

            <View style={styles.searchCard}>
              {/* Origin */}
              <View style={{ zIndex: 20 }}>
                <View style={styles.inputWrapper}>
                  <Ionicons name="location-outline" size={20} />
                  <TextInput
                    style={styles.input}
                    placeholder="From"
                    value={origin}
                    onChangeText={(text) => {
                      setOrigin(text);
                      setShowOriginList(true);
                      setOriginId(null);
                    }}
                  />
                </View>
                {showOriginList && filteredOriginStops.length > 0 && (
                  <View style={[styles.dropdown, { maxHeight: 200 }]}>
                    <ScrollView nestedScrollEnabled keyboardShouldPersistTaps="handled">
                      {filteredOriginStops.map((item) => (
                        <TouchableOpacity
                          key={item.stop_id}
                          onPress={async () => {
                            setOrigin(item.stop_name);
                            setOriginId(item.stop_id);
                            setShowOriginList(false);
                            const routeId = await resolveRouteFromStop(item.stop_id);
                            if (routeId) {
                              setActiveRouteId(routeId);
                              const { data } = await supabase.rpc("get_stops_by_route", { p_route_id: routeId });
                              if (data) setStops(data);
                            }
                          }}
                        >
                          <Text style={styles.dropdownItem}>{item.stop_name}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>

              <TouchableOpacity style={styles.swapIcon} onPress={handleSwap}>
                <Ionicons name="swap-vertical" size={24} color="#2f95dc" />
              </TouchableOpacity>

              {/* Destination */}
              <View style={{ zIndex: 10 }}>
                <View style={styles.inputWrapper}>
                  <Ionicons name="location-outline" size={20} />
                  <TextInput
                    style={styles.input}
                    placeholder="To"
                    value={destination}
                    editable={!!originId}
                    onChangeText={(text) => {
                      setDestination(text);
                      setShowDestinationList(true);
                      setDestinationId(null);
                    }}
                  />
                </View>
                {showDestinationList && filteredDestinationStops.length > 0 && (
                  <View style={[styles.dropdown, { maxHeight: 200 }]}>
                    <ScrollView nestedScrollEnabled keyboardShouldPersistTaps="handled">
                      {filteredDestinationStops.map((item) => (
                        <TouchableOpacity
                          key={item.stop_id}
                          onPress={() => {
                            setDestination(item.stop_name);
                            setDestinationId(item.stop_id);
                            setShowDestinationList(false);
                          }}
                        >
                          <Text style={styles.dropdownItem}>{item.stop_name}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>

              {/* Date Input */}
              <TouchableOpacity style={styles.inputWrapper} onPress={() => showMode("date")}>
                <Ionicons name="calendar-outline" size={20} />
                <Text style={[styles.input, { paddingVertical: 10, marginLeft: 10 }]}>
                  {formatDate(date)}
                </Text>
              </TouchableOpacity>

              {/* Time Input */}
              <TouchableOpacity style={styles.inputWrapper} onPress={() => showMode("time")}>
                <Ionicons name="time-outline" size={20} />
                <Text style={[styles.input, { paddingVertical: 10, marginLeft: 10 }]}>
                  {formatTime(date)}
                </Text>
              </TouchableOpacity>

              {showPicker && (
                <DateTimePicker
                  value={date}
                  mode={pickerMode}
                  is24Hour={false}
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={onDateTimeChange}
                  minimumDate={new Date()}
                />
              )}
              
              {showPicker && Platform.OS === 'ios' && (
                <TouchableOpacity onPress={() => setShowPicker(false)}>
                  <Text style={{ textAlign: 'right', padding: 10, color: '#2f95dc', fontWeight: 'bold' }}>Done</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                <Text style={styles.searchButtonText}>Search</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}