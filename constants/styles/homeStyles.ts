import { StyleSheet } from "react-native";

export const homeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#2f95dc",
    padding: 30,
    paddingTop: 50,
    paddingBottom: 60,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  subGreeting: {
    fontSize: 14,
    color: "#e0e0e0",
    marginTop: 5,
  },
  searchCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: -30,
    borderRadius: 15,
    padding: 20,
    elevation: 5, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#eee",
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  dateText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
  },
  swapIcon: {
    alignItems: "center",
    marginTop: -25,
    marginBottom: -10,
    paddingTop: 20,
    paddingBottom: 20,
    zIndex: 1,
  },
  searchButton: {
    backgroundColor: "#2f95dc",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  searchButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  routeCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginRight: 15,
    width: 150,
    borderWidth: 1,
    borderColor: "#eee",
  },
  routeCity: {
    fontSize: 16,
    fontWeight: "bold",
  },
  routePrice: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
  },
  suggestionContainer: {
    position: "absolute",
    top: 60, // below input
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 6, // Android
    shadowColor: "#000", // iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: "#eee",
    zIndex: 999,
  },

  suggestionItem: {
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  suggestionText: {
    marginLeft: 10,
    fontSize: 14,
    color: "#333",
  },
  dropdown: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginTop: 5,
    // Do not set a fixed height, set a maxHeight
    maxHeight: 200,
    overflow: "hidden", // Ensures content stays inside borders
    elevation: 5, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
});
