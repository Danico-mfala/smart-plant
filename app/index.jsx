import { useRouter } from "expo-router";
import CustomBottom from "../components/CustomBottom";
import {
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
  SafeAreaView,
} from "react-native";
import main from "../assets/images/source/main.jpg";

const { height } = Dimensions.get("window");

export default function HomeScreen() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Image style={styles.main} source={main} />
        </View>
        <View style={styles.bottomSection}>
          <Text style={styles.welcomeText}>Manage Your Plants</Text>
          <Text style={styles.description}>
            This plant app is designed to manage your plant system irrigation.
          </Text>
          <CustomBottom
            onPress={() => router.push("/Login")}
            title="Get Started"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#3D8361",
  },
  container: {
    flex: 1,
  },
  imageContainer: {
    width: "100%",
    height: height * 0.6,
    justifyContent: "flex-end",
    alignItems: "center",
    overflow: "hidden",
    zIndex: 1,
    borderBottomLeftRadius: 200,
    borderBottomRightRadius: 200,
  },
  main: {
    width: "100%",
    height: "100%",
    position: "absolute",
    resizeMode: "cover",
  },
  bottomSection: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 20,
    backgroundColor: "transparent ",
    alignItems: "center",
    justifyContent: "center",
    height: height * 0.4,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginBottom: 15,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#BAD1C2",
    textAlign: "center",
    marginBottom: 30,
  },
});
