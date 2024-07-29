import { useRouter } from "expo-router";
import CustomBottom from "../components/CustomBottom";
import { StyleSheet, View, Text, Image } from "react-native";
import main from "../assets/images/source/main.jpg";

export default function HomeScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome to Smart Plant</Text>
      <View>
        <Image style={styles.main} source={main} />
      </View>
      <View style={{ marginTop: 10 }}>
        <CustomBottom
          onPress={() => router.push("/Login")}
          title="Get Started"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  main: {
    width: 300,
    height: 300,
    resizeMode: "contain",
  },
});
