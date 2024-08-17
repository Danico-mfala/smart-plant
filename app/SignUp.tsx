import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Image, Dimensions } from 'react-native';
import CustomButton from '../components/CustomBottom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import WaveTop from '../components/WaveTop';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';



const { width } = Dimensions.get("window");

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const router = useRouter();

    const handleSignUp = async () => {
        if (password !== confirmPassword) {
            Alert.alert('Password Mismatch', 'The passwords do not match.');
            return;
        }

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            Alert.alert('Success', 'Your account has been created successfully!');
            router.push('/Login');
        } catch (error: any) {
            Alert.alert('Sign Up Error', error.message);
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
                <Image source={require('../assets/images/source/signUpImage.jpg')} style={styles.backgroundImage} />
                <View style={styles.headerContent}>
                    <TouchableOpacity onPress={() => router.push("/")}>
                        <Ionicons name="arrow-back" size={24} color="#59CE8F" />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{ marginBottom: 20, marginTop: 40, }}>
                <WaveTop />
            </View>
            <View style={styles.formContainer}>

                <Text style={styles.title}>Create an Account</Text>
                <Text style={styles.title_1}>Create your new account</Text>
                <View style={{ marginTop: 30, marginBottom: 10 }}>
                    <View style={styles.inputContainer}>
                        <Ionicons name="mail" size={20} color="#59CE8F" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            autoCorrect={false}
                            keyboardType="email-address"
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
                            autoCorrect={false}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                            <MaterialIcons name={showPassword ? "visibility" : "visibility-off"} size={20} color="#59CE8F" style={styles.inputIcon} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.inputContainer}>
                        <Ionicons name="lock-closed" size={20} color="#59CE8F" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry={!showConfirmPassword}
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                        <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                            <MaterialIcons name={showConfirmPassword ? "visibility" : "visibility-off"} size={20} color="#59CE8F" style={styles.inputIcon} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ alignItems: 'center', marginTop: 10 }}>
                    <CustomButton title="Sign Up" onPress={handleSignUp} />
                </View>
                <View style={styles.loginContainer}>
                    <Text style={styles.loginText}>Already have an account?</Text>
                    <TouchableOpacity onPress={() => router.push('/Login')}>
                        <Text style={styles.loginLink}>Login</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAwareScrollView>
    );
};

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
        backgroundColor: '#fff'
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
        color: '#59CE8F',
        fontSize: 16,
    },
});

export default SignUp;
