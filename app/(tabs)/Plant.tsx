import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Switch, Image, Pressable } from 'react-native';
import { signOut } from 'firebase/auth';
import { ref, set, onValue } from 'firebase/database';
import { auth, database } from '../../config/firebaseConfig'; // Ensure correct path
import { router } from 'expo-router';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';

const Plant = () => {
    const [soilMoisture, setSoilMoisture] = useState<number | null>(null);
    const [temperature, setTemperature] = useState<number | null>(null);
    const [humidity, setHumidity] = useState<number | null>(null);
    const [manualOverride, setManualOverride] = useState<string>('off');
    const [isOnline, setIsOnline] = useState<boolean>(false);
    const [autoMode, setAutoMode] = useState<boolean>(true);
    const [pumpOn, setPumpOn] = useState<boolean>(false);

    const SOIL_MOISTURE_THRESHOLD = 30;

    useEffect(() => {
        const soilMoistureRef = ref(database, 'Soil_Moisture_Sensor');
        const manualOverrideRef = ref(database, 'manual_override');
        const systemStatusRef = ref(database, 'system_status/online');
        const weatherDataRef = ref(database, 'Weather_Data');

        const unsubscribeSoilMoisture = onValue(soilMoistureRef, (snapshot) => {
            const data = snapshot.val();
            const moistureLevel = data !== null ? Math.round(Number(data)) : null;
            setSoilMoisture(moistureLevel);

            if (moistureLevel !== null) {
                if (autoMode && moistureLevel < SOIL_MOISTURE_THRESHOLD) {
                    handleManualOverride('on');
                } else if (autoMode) {
                    handleManualOverride('off');
                }
            }
        });

        const unsubscribeManualOverride = onValue(manualOverrideRef, (snapshot) => {
            const data = snapshot.val();
            setManualOverride(data || 'off');
        });

        const unsubscribeSystemStatus = onValue(systemStatusRef, (snapshot) => {
            const data = snapshot.val();
            setIsOnline(data === true);
        });

        const unsubscribeWeatherData = onValue(weatherDataRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setTemperature(data.temperature !== null ? Math.round(data.temperature) : null);
                setHumidity(data.humidity !== null ? Math.round(data.humidity) : null);
            }
        });

        return () => {
            unsubscribeSoilMoisture();
            unsubscribeManualOverride();
            unsubscribeSystemStatus();
            unsubscribeWeatherData();
        };
    }, [autoMode]);

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
        } catch (error: any) {
            Alert.alert('Update Error', error.message);
        }
    };

    const handleSendData = async () => {
        try {
            await set(ref(database, 'plantData/'), {
                soilMoisture,
            });
            Alert.alert('Success', 'Data sent successfully');
        } catch (error: any) {
            Alert.alert('Data Send Error', error.message);
        }
    };

    const toggleAutoMode = async () => {
        const newMode = !autoMode;
        setAutoMode(newMode);
        try {
            await set(ref(database, 'auto_mode'), newMode ? 'on' : 'off');
        } catch (error: any) {
            Alert.alert('Update Error', error.message);
        }
    };

    const handlePumpControl = async (status: boolean) => {
        try {
            await set(ref(database, 'manual_pump_status'), status ? 'on' : 'off');
            setPumpOn(status); // Update local state
        } catch (error: any) {
            Alert.alert('Update Error', error.message);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Smart Plant System</Text>
                <TouchableOpacity onPress={handleSignOut} style={styles.logoutButton}>
                    <Text style={styles.logoutButtonText}>Log Out</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.box}>
                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ fontSize: 23 }}>Weather</Text>
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10 }} >
                        <Image source={require('../../assets/images/source/cloud.gif')} style={{ width: 80, height: 80 }} />
                        <Text style={{ fontSize: 23, fontWeight: 'bold' }}>{temperature !== null ? `${temperature}°C` : 'Loading...'}</Text>
                    </View>
                </View>
                <View style={{ display: 'flex', flexDirection: 'row', gap: 20, marginTop: 10, justifyContent: 'center' }}>
                    <View style={{ gap: 5 }}>
                        <FontAwesome5 name="temperature-high" size={24} color="#399918" />
                        <Text>{temperature !== null ? `${temperature}°C` : 'Loading...'}</Text>
                        <Text style={{ color: '#888' }}>Temperature</Text>
                    </View>
                    <View style={{ gap: 5 }}>
                        <Ionicons name="water" size={24} color="#399918" />
                        <Text>{humidity !== null ? `${humidity}%` : 'Loading...'}</Text>
                        <Text style={{ color: '#888' }}>Humidity</Text>
                    </View>
                    <View style={{ gap: 5 }}>
                        <FontAwesome5 name="hand-holding-water" size={24} color="#399918" />
                        <Text>{soilMoisture !== null ? `${soilMoisture}%` : 'Loading...'}</Text>
                        <Text style={{ color: '#888' }}>Soil Moisture</Text>
                    </View>
                    <View style={{ gap: 5 }}>
                        <Feather name="wind" size={24} color="#399918" />
                        <Text>{soilMoisture !== null ? `${soilMoisture}%` : 'Loading...'}</Text>
                        <Text style={{ color: '#888' }}>Wind</Text>
                    </View>
                </View>
            </View>

            <View style={{ display: 'flex', flexDirection: 'row', marginTop: 25, width: 200, height: 200, gap: 10 }}>
                <View>
                    <Image source={require('../../assets/images/source/plant.png')} style={{ width: 200, height: 280 }} />
                </View>
                <View>
                    <Text style={{ fontSize: 30, fontWeight: '800' }}>Your Plant</Text>
                    <View style={{ gap: 6, marginTop: 10 }}>
                        <View>
                            <Text style={{ fontSize: 32, fontWeight: 'bold', marginTop: 20 }}>{soilMoisture !== null ? `${soilMoisture}%` : 'Loading...'}</Text>
                            <Text style={{ color: '#888', fontWeight: '400', }}>Soil Moisture:</Text>
                        </View>
                        <View>
                            <Text style={{ fontSize: 32, fontWeight: 'bold', marginTop: 20 }}>{temperature !== null ? `${temperature}°C` : 'Loading...'}</Text>
                            <Text style={{ color: '#888', fontWeight: '400', }}>Temperature:</Text>
                        </View>
                        <View>
                            <Text style={{ fontSize: 32, fontWeight: 'bold', marginTop: 20 }}>{humidity !== null ? `${humidity}%` : 'Loading...'}</Text>
                            <Text style={{ color: '#888', fontWeight: '400', }}>Humidity:</Text>
                        </View>
                    </View>
                </View>
            </View>

            <View style={{ marginTop: 100 }}>
                <Text style={{ fontSize: 28, fontWeight: '800' }}>Plant Care Tips</Text>
                <Text style={{ fontSize: 18, marginTop: 10 }}>
                    Keep your plant hydrated and in a well-lit area. Monitor soil moisture and adjust watering as needed.
                </Text>
            </View>

            <View style={styles.controlSection}>
                <View style={styles.autoModeContainer}>
                    <Text style={styles.autoModeText}>Automatic Mode:</Text>
                    <Switch
                        value={autoMode}
                        onValueChange={toggleAutoMode}
                        thumbColor={autoMode ? '#4CAF50' : '#f4f3f4'}
                        trackColor={{ false: '#767577', true: '#81b0ff' }}
                    />
                </View>

                {!autoMode && (
                    <Pressable
                        style={[styles.button, { backgroundColor: pumpOn ? '#f44336' : '#4CAF50' }]}
                        onPressIn={() => handlePumpControl(true)}
                        onPressOut={() => handlePumpControl(false)}
                    >
                        <Text style={styles.buttonText}>{pumpOn ? 'Pump On' : 'Pump Off'}</Text>
                    </Pressable>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    logoutButton: {
        backgroundColor: '#ff3d00',
        padding: 10,
        borderRadius: 5,
    },
    logoutButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    box: {
        marginTop: 20,
        padding: 15,
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    controlSection: {
        marginTop: 30,
        alignItems: 'center',
    },
    autoModeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    autoModeText: {
        fontSize: 18,
    },
    button: {
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default Plant;
