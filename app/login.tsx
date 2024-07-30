import { useState } from "react";
import { useRouter } from "expo-router";
import { StyleSheet, View, Text, TextInput, Alert, TouchableOpacity, Image, Dimensions } from "react-native";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebaseConfig'; // Ensure correct path
import CustomBottom from "../components/CustomBottom";
import { Ionicons, MaterialIcons } from '@expo/vector-icons'; // For icons
import WaveTop from '../components/WaveTop'; // Import the wave effect component

// Import an image for the top of the page
import loginBg from '../assets/images/source/loginM.jpg'; // Update with your actual image path

const { width } = Dimensions.get("window");

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

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
            <View style={styles.header}>
                <Image source={loginBg} style={styles.backgroundImage} />
                <View style={styles.headerContent}>
                    <TouchableOpacity onPress={() => router.push("/")}>
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.formContainer}>
                <WaveTop />
                <Text style={styles.title}>Welcome Back</Text>
                <Text style={styles.title_1}>Login to your account</Text>
                <View style={{ marginTop: 30, marginBottom: 10 }}>
                    <View style={styles.inputContainer}>
                        <Ionicons name="mail" size={20} color="#59CE8F" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Ionicons name="lock-closed" size={20} color="#59CE8F" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                            autoCapitalize="none"
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                            <MaterialIcons name={showPassword ? "visibility" : "visibility-off"} size={20} color="#59CE8F" style={styles.inputIcon} />
                        </TouchableOpacity>
                    </View>
                </View>
                <CustomBottom onPress={handleLogin} title="Log in" />
                <View style={styles.loginContainer}>
                    <Text style={styles.loginText}>Don't have an account?</Text>
                    <TouchableOpacity onPress={() => router.push('/SignUp')}>
                        <Text style={styles.loginLink}>Sign up</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        position: 'relative',
        width: '100%',
        height: '40%',
    },
    backgroundImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        position: 'absolute',
        top: 0,
        left: 0,
    },
    headerContent: {
        position: 'absolute',
        left: 20,
        top: 30,
        flexDirection: 'row',
        alignItems: 'center',
        width: 40,
        height: 40,
        textAlign: 'center',
        justifyContent: "center",
        borderRadius: 50,
        backgroundColor: '#59CE8F'
    },
    formContainer: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
        paddingTop: 40,
        marginTop: -60, // Adjust this value if needed to ensure overlap
        position: 'relative',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },
    title_1: {
        fontSize: 13,
        color: '#333',
        textAlign: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        marginBottom: 15,
    },
    input: {
        flex: 1,
        padding: 15,
        fontSize: 16,
        color: '#333',
    },
    inputIcon: {
        marginRight: 10,
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    loginText: {
        marginRight: 5,
        color: '#888',
        fontSize: 16,
    },
    loginLink: {
        color: '#399918',
        fontSize: 16,
    },
});
