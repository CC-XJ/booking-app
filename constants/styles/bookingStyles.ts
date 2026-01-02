import { StyleSheet } from "react-native";

const bookingStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  screenHeader: { padding: 20, backgroundColor: "#2f95dc" },
  screenTitle: { color: "white", fontSize: 18, fontWeight: "bold" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: "#2f95dc",
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
  routeText: { fontSize: 16, fontWeight: "bold", color: "#2f95dc" },
  badge: { backgroundColor: "#e1f5fe", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  badgeText: { fontSize: 10, color: "#0288d1", fontWeight: "bold" },
  detailsContainer: { borderTopWidth: 1, borderTopColor: "#f0f0f0", paddingTop: 12 },
  detailRow: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  detailText: { marginLeft: 8, color: "#555", fontSize: 14 },
  cardFooter: { marginTop: 10, borderTopWidth: 1, borderTopColor: "#f0f0f0", paddingTop: 8 },
  purchaseDate: { fontSize: 11, color: "#999", fontStyle: "italic" },
  emptyContainer: { alignItems: "center", marginTop: 100 },
  emptyText: { marginTop: 10, color: "#999", fontSize: 16 },
});

export default bookingStyles;