import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Switch } from 'react-native';
import { signOut } from 'firebase/auth';
import { ref, set, onValue } from 'firebase/database';
import { auth, database } from '../../config/firebaseConfig'; // Ensure correct path
import { router } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';

const Plant = () => {
    const [soilMoisture, setSoilMoisture] = useState<number | null>(null);
    const [temperature, setTemperature] = useState<string>('');
    const [wateringSchedule, setWateringSchedule] = useState<string>(''); // e.g., 'daily', 'weekly'
    const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(false);
    const [manualOverride, setManualOverride] = useState<string>('off');
    const [isOnline, setIsOnline] = useState<boolean>(false);

    useEffect(() => {
        const soilMoistureRef = ref(database, 'Soil_Moisture_Sensor');
        const manualOverrideRef = ref(database, 'manual_override');
        const systemStatusRef = ref(database, 'system_status/online');

        const unsubscribeSoilMoisture = onValue(soilMoistureRef, (snapshot) => {
            const data = snapshot.val();
            setSoilMoisture(data !== null ? Number(data) : null);
        });

        const unsubscribeManualOverride = onValue(manualOverrideRef, (snapshot) => {
            const data = snapshot.val();
            setManualOverride(data || 'off');
        });

        const unsubscribeSystemStatus = onValue(systemStatusRef, (snapshot) => {
            const data = snapshot.val();
            setIsOnline(data === true);
        });

        return () => {
            unsubscribeSoilMoisture();
            unsubscribeManualOverride();
            unsubscribeSystemStatus();
        };
    }, []);

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            Alert.alert('Success', 'You have been logged out.');
            router.push('/Login');
        } catch (error: any) {
            Alert.alert('Sign Out Error', error.message);
        }
    };

    const handleManualOverride = async (status: string) => {
        try {
            await set(ref(database, 'manual_override'), status);
            Alert.alert('Success', `Motor turned ${status.toUpperCase()}`);
        } catch (error: any) {
            Alert.alert('Update Error', error.message);
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
                <Feather name="user" size={24} color="black" />
                <Text style={styles.title}>Dashboard</Text>
                <TouchableOpacity onPress={handleSignOut} style={styles.logoutButton}>
                    <Text style={styles.logoutButtonText}>Logout</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.box}>
                <Text style={styles.label}>Plant Status:</Text>
                {soilMoisture !== null ? (
                    <Text style={styles.data}>Soil Moisture: {soilMoisture.toFixed(2)}%</Text>
                ) : (
                    <Text style={styles.data}>Soil Moisture: Loading...</Text>
                )}
                <Text style={styles.data}>Temperature: {temperature || 'Loading...'}</Text>
                <Text style={styles.data}>Watering Schedule: {wateringSchedule || 'Loading...'}</Text>
                <View style={styles.switchContainer}>
                    <Text style={styles.switchLabel}>Notifications Enabled:</Text>
                    <Switch
                        value={notificationsEnabled}
                        onValueChange={setNotificationsEnabled}
                    />
                </View>
                <Text style={styles.data}>System Status: {isOnline ? 'Online' : 'Offline'}</Text>
                <TouchableOpacity onPress={handleSendData} style={styles.sendButton}>
                    <Text style={styles.sendButtonText}>Update Data</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleManualOverride('on')} style={styles.sendButton}>
                    <Text style={styles.sendButtonText}>Turn Motor ON</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleManualOverride('off')} style={styles.sendButton}>
                    <Text style={styles.sendButtonText}>Turn Motor OFF</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f0f0f0',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    logoutButton: {
        backgroundColor: '#ff0000',
        padding: 10,
        borderRadius: 5,
    },
    logoutButtonText: {
        color: '#ffffff',
        fontWeight: 'bold',
    },
    box: {
        backgroundColor: '#ffffff',
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    data: {
        fontSize: 16,
        marginBottom: 10,
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    switchLabel: {
        fontSize: 16,
        marginRight: 10,
    },
    sendButton: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    sendButtonText: {
        color: '#ffffff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default Plant;