import { StyleSheet } from "react-native";

const profileStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  profileCard: {
    width: "100%",
    padding: 20,
    borderRadius: 15,
    backgroundColor: "#f9f9f9", // Note: use themed colors if you want dark mode support
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "#eee",
  },
  label: {
    fontSize: 12,
    color: "#888",
    textTransform: "uppercase",
    marginBottom: 4,
    fontWeight: "bold",
  },
  infoText: {
    fontSize: 18,
    marginBottom: 15,
    color: "#000",
  },
  infoTextSmall: {
    fontSize: 12,
    color: "#666",
  },
  signOutButton: {
    backgroundColor: "#FF3B30",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  signOutText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  errorButton: {
    backgroundColor: "#FF3B30",
    marginTop: 24,
    paddingVertical: 8,
    borderRadius: 10,
    width: "30%",
    alignItems: "center",
  },
  errorText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  }
});

export default profileStyles;
