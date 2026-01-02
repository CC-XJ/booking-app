import { StyleSheet } from "react-native";

const seatStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { padding: 20, backgroundColor: "#2f95dc", alignItems: "center"},
  headerTitle: { color: "white", fontSize: 18, fontWeight: "bold" },
  headerSub: { color: "white", opacity: 0.8 },
  busLayout: { padding: 20, alignItems: "center" },
  steeringWrapper: {
    alignSelf: "flex-start",
    marginBottom: 20,
    alignItems: "center",
    marginLeft: 75,
  },
  row: { flexDirection: "row", marginBottom: 15, alignItems: "center" },
  seatGroup: { flexDirection: "row" },
  aisle: { width: 40 },
  seat: {
    width: 50,
    height: 50,
    margin: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#2f95dc",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  bookedSeat: { backgroundColor: "#eee", borderColor: "#ccc" },
  selectedSeat: { backgroundColor: "#2f95dc" },
  seatText: { fontSize: 12, color: "#2f95dc" },
  footer: { padding: 20, borderTopWidth: 1, borderColor: "#eee" },
  btn: {
    backgroundColor: "#2f95dc",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
});

export default seatStyles;
