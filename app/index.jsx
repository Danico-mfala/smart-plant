import { useRouter } from "expo-router";
import CustomBottom from "../components/CustomBottom";
import { StyleSheet, View, Text } from "react-native";

export default function HomeScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text>Hello Danico</Text>

      <View
        style={{
          marginTop: 10,
        }}
      >
        <CustomBottom
          onPress={() => router.push("/plant")}
          title="Get started"
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
  },
});
