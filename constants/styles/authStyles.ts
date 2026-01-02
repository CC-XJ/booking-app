import { StyleSheet } from "react-native";

const authStyles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5', // Light grey background makes the white card pop
  },
  scrollContainer: {
    flexGrow: 1, // Ensures the content takes up the full height
    justifyContent: 'center', // This centers the card vertically
    padding: 20, // Padding around the card
  },
  card: {
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 15,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    // Shadow for Android
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e6e6e6',
    padding: 15,
    borderRadius: 10,
    marginBottom: 16,
    backgroundColor: '#fafafa',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#2f95dc',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  linkText: {
    color: '#2f95dc',
    textAlign: 'center',
    marginTop: 20,
    fontWeight: '500',
  },
});

export default authStyles;