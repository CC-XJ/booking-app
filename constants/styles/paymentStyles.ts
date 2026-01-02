import { StyleSheet } from "react-native";

const paymentStyles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  box: {
    padding: 20,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    marginBottom: 30,
  },
  price: { fontSize: 20, fontWeight: "bold", marginTop: 10, color: "#2f95dc" },
  payBtn: {
    backgroundColor: "#2f95dc",
    padding: 18,
    borderRadius: 10,
    alignItems: "center",
  },
  payBtnText: { color: "white", fontWeight: "bold", fontSize: 18 },
});

export default paymentStyles;
