import { useState } from "react";
import { useRouter } from "expo-router";
import { StyleSheet, View, Text, TextInput, Button, Alert, TouchableOpacity } from "react-native";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebaseConfig'; // Ensure correct path
import CustomBottom from "../components/CustomBottom";

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push("/Plant");
        } catch (error: any) {
            console.error("Error logging in: ", error);
            Alert.alert("Login Failed", error.message);
        }
    };



    return (
        <View style={styles.container}>
            <View style={{ marginBottom: 30 }} >

                <TouchableOpacity onPress={() => router.push('./index')}>
                    <Text>Back</Text>
                </TouchableOpacity>
            </View>


            <Text style={styles.title}>Login</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
            />
            <CustomBottom onPress={handleLogin} title="Login" />

            <View style={styles.loginContainer}>
                <Text style={styles.loginText}>don't have an account?</Text>
                <TouchableOpacity onPress={() => router.push('/SignUp')}>
                    <Text style={styles.loginLink}>Sign up</Text>
                </TouchableOpacity>
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
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        color: '#333',
    },
    input: {
        width: '100%',
        padding: 15,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 15,
    },
    loginContainer: {
        flexDirection: 'row',
        marginTop: 20,
    },
    loginText: {
        marginRight: 5,
        color: '#888',
    },
    loginLink: {
        color: '#007BFF',
    },
});
