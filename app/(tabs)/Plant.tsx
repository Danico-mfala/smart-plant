import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Switch, Image } from 'react-native';
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

    const SOIL_MOISTURE_THRESHOLD = 30; // Adjust the threshold as needed

    useEffect(() => {
        const soilMoistureRef = ref(database, 'Soil_Moisture_Sensor');
        const manualOverrideRef = ref(database, 'manual_override');
        const systemStatusRef = ref(database, 'system_status/online');
        const weatherDataRef = ref(database, 'Weather_Data');

        const unsubscribeSoilMoisture = onValue(soilMoistureRef, (snapshot) => {
            const data = snapshot.val();
            const moistureLevel = data !== null ? Number(data) : null;
            setSoilMoisture(moistureLevel);

            if (moistureLevel !== null && moistureLevel < SOIL_MOISTURE_THRESHOLD) {
                handleManualOverride('on');
            } else {
                handleManualOverride('off');
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
                setTemperature(data.temperature || null);
                setHumidity(data.humidity || null);
            }
        });

        return () => {
            unsubscribeSoilMoisture();
            unsubscribeManualOverride();
            unsubscribeSystemStatus();
            unsubscribeWeatherData();
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

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Smart Plant System</Text>
                <TouchableOpacity onPress={handleSignOut} style={styles.logoutButton}>
                    <Text style={styles.logoutButtonText}>Log Out</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.box}>
                {/* <Text style={styles.label}>Soil Moisture:</Text>
                <Text style={styles.data}>{soilMoisture !== null ? `${soilMoisture.toFixed(2)}%` : 'Loading...'}</Text> */}
                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ fontSize: 23 }}>Weatheer</Text>
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10 }} >
                        <Image source={require('../../assets/images/source/cloud.gif')} style={{ width: 80, height: 80 }} />
                        <Text style={{ fontSize: 23, fontWeight: 'bold' }}>{temperature !== null ? `${temperature.toFixed(2)}°C` : 'Loading...'}</Text>
                    </View>
                </View>
                <View style={{ display: 'flex', flexDirection: 'row', gap: 20, marginTop: 10, justifyContent: 'center' }}>
                    <View style={{ gap: 5 }}>

                        <FontAwesome5 name="temperature-high" size={24} color="#399918" />
                        <Text style={{}}>{temperature !== null ? `${temperature.toFixed(2)}°C` : 'Loading...'}</Text>
                        <Text style={{ color: '#888' }}>Temperature</Text>
                    </View>
                    <View style={{ gap: 5 }}>

                        <Ionicons name="water" size={24} color="#399918" />
                        <Text style={{}}>{humidity !== null ? `${humidity.toFixed(2)}%` : 'Loading...'}</Text>
                        <Text style={{ color: '#888' }}>Humidity</Text>
                    </View>

                    <View style={{ gap: 5 }}>
                        <FontAwesome5 name="hand-holding-water" size={24} color="#399918" />
                        <Text style={{}}>{soilMoisture !== null ? `${soilMoisture.toFixed(2)}%` : 'Loading...'}</Text>
                        <Text style={{ color: '#888' }}>Soil Moisture</Text>
                    </View>
                    <View style={{ gap: 5 }}>
                        <Feather name="wind" size={24} color="#399918" />
                        <Text style={{}}>{soilMoisture !== null ? `${soilMoisture.toFixed(2)}%` : 'Loading...'}</Text>
                        <Text style={{ color: '#888' }}>wind</Text>
                    </View>

                </View>


            </View>



            <View style={{ display: 'flex', flexDirection: 'row', marginTop: 20, width: 200, height: 200 }}>
                <View>
                    <Image source={require('../../assets/images/source/plant.jpg')} style={{ width: 180, height: 280 }} />
                </View>
                <View>
                    <Text style={styles.label}>Soil Moisture:</Text>
                    <Text style={styles.data}>{soilMoisture !== null ? `${soilMoisture.toFixed(2)}%` : 'Loading...'}</Text>

                    <Text style={styles.label}>Temperature:</Text>
                    <Text style={styles.data}>{temperature !== null ? `${temperature.toFixed(2)}°C` : 'Loading...'}</Text>

                    <Text style={styles.label}>Humidity:</Text>
                    <Text style={styles.data}>{humidity !== null ? `${humidity.toFixed(2)}%` : 'Loading...'}</Text>

                    <Text style={styles.label}>Manual Override:</Text>
                    <View style={styles.switchContainer}>
                        <Text style={styles.switchLabel}>{manualOverride === 'on' ? 'Motor ON' : 'Motor OFF'}</Text>
                        <Switch
                            value={manualOverride === 'on'}
                            onValueChange={(value) => handleManualOverride(value ? 'on' : 'off')}
                        />
                    </View>
                </View>

                {/* <TouchableOpacity onPress={handleSendData} style={styles.sendButton}>
                    <Text style={styles.sendButtonText}>Send Data</Text>
                </TouchableOpacity> */}
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
