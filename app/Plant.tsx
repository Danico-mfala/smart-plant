import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Switch } from 'react-native';
import { signOut } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { auth, database } from '../config/firebaseConfig'; // Ensure correct path
import { router } from 'expo-router';

const Plant = () => {
    const [soilMoisture, setSoilMoisture] = useState('');
    const [temperature, setTemperature] = useState('');
    const [wateringSchedule, setWateringSchedule] = useState(''); // e.g., 'daily', 'weekly'
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            Alert.alert('Success', 'You have been logged out.');
            router.push('Login')
        } catch (error: any) {
            Alert.alert('Sign Out Error', error.message);
        }
    };

    const handleSendData = async () => {
        try {
            await set(ref(database, 'plantData/'), {
                soilMoisture,
                temperature,
                wateringSchedule,
                notificationsEnabled,
            });
            Alert.alert('Success', 'Data has been updated.');
        } catch (error: any) {
            Alert.alert('Update Error', error.message);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Plant Data</Text>
                <TouchableOpacity onPress={handleSignOut} style={styles.logoutButton}>
                    <Text style={styles.logoutButtonText}>Logout</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.dataSection}>
                <TextInput
                    style={styles.input}
                    placeholder="Soil Moisture"
                    value={soilMoisture}
                    onChangeText={setSoilMoisture}
                    keyboardType="numeric"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Temperature"
                    value={temperature}
                    onChangeText={setTemperature}
                    keyboardType="numeric"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Watering Schedule"
                    value={wateringSchedule}
                    onChangeText={setWateringSchedule}
                />
                <View style={styles.switchContainer}>
                    <Text style={styles.switchLabel}>Enable Notifications</Text>
                    <Switch
                        value={notificationsEnabled}
                        onValueChange={setNotificationsEnabled}
                    />
                </View>
                <TouchableOpacity onPress={handleSendData} style={styles.sendButton}>
                    <Text style={styles.sendButtonText}>Send Data</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    logoutButton: {
        backgroundColor: '#d9534f',
        padding: 10,
        borderRadius: 5,
    },
    logoutButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    dataSection: {
        flex: 1,
        justifyContent: 'center',
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
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    switchLabel: {
        marginRight: 10,
        fontSize: 16,
    },
    sendButton: {
        backgroundColor: '#007BFF',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    sendButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default Plant;
