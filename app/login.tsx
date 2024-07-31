import React, { useState } from "react";
import { useRouter } from "expo-router";
import { StyleSheet, View, Text, TextInput, Alert, TouchableOpacity, Image, Dimensions, Platform } from "react-native";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import CustomBottom from "../components/CustomBottom";
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import WaveTop from '../components/WaveTop';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const { width } = Dimensions.get("window");

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const handleLogin = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push("./(tabs)/Plant");
        } catch (error: any) {
            console.error("Error logging in: ", error);
            Alert.alert("Login Failed", error.message);
        }
    };

    return (
        <KeyboardAwareScrollView
            contentContainerStyle={styles.container}
            enableOnAndroid={true}
            extraScrollHeight={20}
            keyboardShouldPersistTaps="handled"
        >
            <View style={styles.header}>
                <Image source={require('../assets/images/source/loginM.jpg')} style={styles.backgroundImage} />

                <View style={styles.headerContent}>
                    <TouchableOpacity onPress={() => router.push("/")}>
                        <Ionicons name="arrow-back" size={24} color="#59CE8F" />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{ marginBottom: 20, marginTop: 40 }}>
                <WaveTop />
            </View>

            <View style={styles.formContainer}>
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
                            <MaterialIcons name={showPassword ? "visibility" : "visibility-off"} size={20} color="#59CE8F" style={styles.passwordIcon} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.optionsContainer}>
                        <TouchableOpacity style={styles.checkboxContainer} onPress={() => setRememberMe(!rememberMe)}>
                            <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                                {rememberMe && <Ionicons name="checkmark" size={16} color="#fff" />}
                            </View>
                            <Text style={styles.checkboxLabel}>Remember Me</Text>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Text style={styles.forgotPasswordText}>Forgot password?</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.loginButtonContainer}>
                    <CustomBottom onPress={handleLogin} title="Log in" />
                </View>
                <View style={styles.signupContainer}>
                    <Text style={styles.signupText}>Don't have an account?</Text>
                    <TouchableOpacity onPress={() => router.push('/SignUp')}>
                        <Text style={styles.signupLink}>Sign up</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAwareScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
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
        backgroundColor: 'white'
    },
    formContainer: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
        paddingTop: 40,
        marginTop: -60,
        position: 'relative',
    },
    title: {
        fontSize: 38,
        fontWeight: 'bold',
        color: '#59CE8F',
        marginBottom: 10,
        textAlign: 'center',
    },
    title_1: {
        fontSize: 13,
        color: '#888',
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
    passwordIcon: {
        marginRight: 10,
    },
    optionsContainer: {
        display: "flex",
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        width: 18,
        height: 18,
        borderWidth: 1,
        borderColor: '#59CE8F',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
        borderRadius: 3
    },
    checkboxChecked: {
        backgroundColor: '#59CE8F',
    },
    checkboxLabel: {
        color: '#888',
        fontSize: 17,
    },
    forgotPasswordText: {
        color: '#59CE8F',
        fontSize: 17,
    },
    loginButtonContainer: {
        alignItems: 'center',
        marginTop: 30,
    },
    signupContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    signupText: {
        marginRight: 5,
        color: '#888',
        fontSize: 16,
    },
    signupLink: {
        color: '#399918',
        fontSize: 16,
    },
});
