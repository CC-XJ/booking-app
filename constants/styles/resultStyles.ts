import { StyleSheet } from "react-native";

const resultStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  infoBar: { padding: 16, backgroundColor: "#2f95dc", alignItems: "center" },
  routeText: { color: "white", fontWeight: "bold", fontSize: 16 },
  dateText: { color: "white", opacity: 0.8 },
  busCard: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    elevation: 2,
  },
  operatorText: { fontSize: 18, fontWeight: "bold" },
  busType: { color: "gray", fontSize: 12 },
  timeText: { marginLeft: 4, color: "#2f95dc", fontWeight: "600" },
  priceContainer: { alignItems: "flex-end", justifyContent: "center" },
  priceText: { marginBottom: 12, fontSize: 18, fontWeight: "bold", color: "#2f95dc" },
});

export default resultStyles;
