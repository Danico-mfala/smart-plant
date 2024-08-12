import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Switch, Image, Pressable, ImageBackground } from 'react-native';
import { signOut } from 'firebase/auth';
import { ref, set, onValue } from 'firebase/database';
import { auth, database } from '../../config/firebaseConfig'; // Ensure correct path
import { router } from 'expo-router';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import AntDesign from '@expo/vector-icons/AntDesign';
import backgroundImage from '../../assets/images/source/back.png';

const Plant = () => {
    const [soilMoisture, setSoilMoisture] = useState<number | null>(null);
    const [temperature, setTemperature] = useState<number | null>(null);
    const [humidity, setHumidity] = useState<number | null>(null);
    const [manualOverride, setManualOverride] = useState<string>('off');
    const [isOnline, setIsOnline] = useState<boolean>(false);
    const [autoMode, setAutoMode] = useState<boolean>(true);
    const [pumpOn, setPumpOn] = useState<boolean>(false);
    const [waterLevel, setWaterLevel] = useState<number | null>(null);

    const SOIL_MOISTURE_THRESHOLD = 30;

    useEffect(() => {
        const soilMoistureRef = ref(database, 'Soil_Moisture_Sensor');
        const manualOverrideRef = ref(database, 'manual_override');
        const systemStatusRef = ref(database, 'system_status/online');
        const weatherDataRef = ref(database, 'Weather_Data');
        const waterLevelRef = ref(database, 'Water_Level_Sensor');

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

        const unsubscribeWaterLevel = onValue(waterLevelRef, (snapshot) => { // New listener for water level
            const data = snapshot.val();
            setWaterLevel(data !== null ? Math.round(Number(data)) : null);
        });


        return () => {
            unsubscribeSoilMoisture();
            unsubscribeManualOverride();
            unsubscribeSystemStatus();
            unsubscribeWeatherData();
            unsubscribeWaterLevel();
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
                <Text style={styles.title}>Hey,Danico</Text>
                <TouchableOpacity onPress={handleSignOut} style={styles.logoutButton}>
                    {/* <Text style={styles.logoutButtonText}>
                    </Text> */}
                    <AntDesign name="logout" size={24} color="black" />
                </TouchableOpacity>
            </View>
            <ImageBackground
                source={backgroundImage}
                style={styles.box}
                resizeMode="cover"
            >
                <View style={styles.overlay} />
                <View style={{ display: 'flex', flexDirection: 'row', gap: 20, marginTop: 10, justifyContent: 'center' }}>
                    <View style={{ gap: 5, alignItems: 'center' }}>
                        <FontAwesome5 name="temperature-high" size={28} color="#F4CE14" />
                        <Text style={{ color: 'white', fontSize: 16 }}>{temperature !== null ? `${temperature}°C` : 'Loading...'}</Text>
                        <Text style={{ color: 'white', fontWeight: '600', fontSize: 18 }}>Temperature</Text>
                    </View>
                    <View style={{ gap: 5, alignItems: 'center' }}>
                        <Ionicons name="water" size={28} color="#5DEBD7" />
                        <Text style={{ color: 'white', fontSize: 16 }}>{humidity !== null ? `${humidity}%` : 'Loading...'}</Text>
                        <Text style={{ color: 'white', fontWeight: '600', fontSize: 16 }}>Humidity</Text>
                    </View>
                    <View style={{ gap: 5, alignItems: 'center' }}>
                        <FontAwesome5 name="hand-holding-water" size={28} color="#C1F2B0" />
                        <Text style={{ color: 'white', fontSize: 16 }}>{soilMoisture !== null ? `${soilMoisture}%` : 'Loading...'}</Text>
                        <Text style={{ color: 'white', fontWeight: '600', fontSize: 16 }}>Soil Moisture</Text>
                    </View>
                    <View style={{ gap: 5, alignItems: 'center' }}>
                        <Feather name="wind" size={28} color="#279EFF" />
                        <Text style={{ color: 'white', fontSize: 16 }}>{soilMoisture !== null ? `${soilMoisture}%` : 'Loading...'}</Text>
                        <Text style={{ color: 'white', fontWeight: '600', fontSize: 16 }}>Wind</Text>
                    </View>
                </View>
            </ImageBackground>



            <View style={{ display: 'flex', flexDirection: 'row', marginTop: 25, width: 200, height: 200, gap: 10 }}>
                <View>
                    <Image source={require('../../assets/images/source/plant.png')} style={{ width: 170, height: 280 }} />
                </View>
                <View>
                    <Text style={{ fontSize: 30, fontWeight: '800' }}>Your Plant</Text>
                    <View style={{ gap: 6, marginTop: 10 }}>
                        <View style={{ display: 'flex', flexDirection: 'row', gap: 10 }}>
                            <View style={{ width: 100, height: 100, backgroundColor: '#FFF67E', padding: 4, borderRadius: 5 }}>
                                <Text style={{ fontSize: 28, fontWeight: 'bold', marginTop: 20 }}>{soilMoisture !== null ? `${soilMoisture}%` : 'Loading...'}</Text>
                                <Text style={{ color: '#888', fontWeight: '400', }}>Soil Moisture</Text>
                            </View>
                            <View style={{ width: 80, height: 100, backgroundColor: '#FFB996', padding: 4, borderRadius: 5 }}       >
                                <Text style={{ fontSize: 32, fontWeight: 'bold', marginTop: 20 }}>{temperature !== null ? `${temperature}°C` : 'Loading...'}</Text>
                                <Text style={{ color: 'white', fontWeight: '400', }}>Temperature</Text>
                            </View>
                        </View>
                        <View style={{ display: 'flex', flexDirection: 'row', gap: 10 }}>
                            <View style={{ width: 80, height: 100, backgroundColor: '#FFD23F', padding: 4, borderRadius: 5 }}>
                                <Text style={{ fontSize: 28, fontWeight: 'bold', marginTop: 20 }}>{humidity !== null ? `${humidity}%` : 'Loading...'}</Text>
                                <Text style={{ color: '#fff', fontWeight: '400', fontSize: 18 }}>Humidity</Text>
                            </View>
                            <View style={{ width: 100, height: 90, backgroundColor: '#40A2E3', padding: 4, borderRadius: 5, justifyContent: 'center', alignItems: 'center', gap: 5 }}>
                                <Text style={{ fontSize: 23, fontWeight: 'bold', color: '#fff' }}>{waterLevel !== null ? `${waterLevel}%` : 'Loading...'}</Text>
                                <Text style={{ color: '#fff', fontWeight: '400', fontSize: 18 }}>Water Level</Text>
                            </View>
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

        padding: 10,
        borderRadius: 5,
    },
    logoutButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    box: {
        marginTop: 25,
        padding: 10,
        borderRadius: 10,

        height: 100,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        borderRadius: 10,
    },
    controlSection: {
        marginTop: 30,
        alignItems: 'center',
    },
    autoModeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 20,
    },
    autoModeText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    button: {
        width: 150,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
    },
});



export default Plant;
