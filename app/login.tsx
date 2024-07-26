import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import CustomButton from "../components/CustomBottom";
import { router } from 'expo-router';

const Login = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        console.log('Login');
        // Add your login logic here
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome Back</Text>
            <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
            />
            <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                <Text style={styles.forgotPassword}>Forgot Password?</Text>
            </TouchableOpacity>
            <CustomButton title="Login" onPress={handleLogin} />
            <View style={styles.signupContainer}>
                <Text style={styles.signupText}>Don't have an account?</Text>
                <TouchableOpacity onPress={() => router.push('SignUp')}>
                    <Text style={styles.signupLink}>Sign Up</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        height: 40,
        backgroundColor: '#fff',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: 20,
        color: '#007BFF',
    },
    signupContainer: {
        flexDirection: 'row',
        marginTop: 20,
    },
    signupText: {
        marginRight: 5,
        color: '#888',
    },
    signupLink: {
        color: '#399918',
    },
});

export default Login;
