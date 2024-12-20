import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Switch,
    Image,
    Pressable,
    ImageBackground
} from 'react-native';
import { signOut } from 'firebase/auth';
import { ref, set, onValue } from 'firebase/database';
import { auth, database } from '../../config/firebaseConfig';
import { router } from 'expo-router';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import backgroundImage from '../../assets/images/source/back.png';
import CircularProgress from 'react-native-circular-progress-indicator';
import Feather from '@expo/vector-icons/Feather';

import { sendWaterLevelNotification } from '../../utils/notifications';


const Plant = () => {
    const [soilMoisture, setSoilMoisture] = useState<number | null>(null);
    const [temperature, setTemperature] = useState<number | null>(null);
    const [humidity, setHumidity] = useState<number | null>(null);
    const [manualOverride, setManualOverride] = useState<string>('off');
    const [isOnline, setIsOnline] = useState<boolean>(false);
    const [autoMode, setAutoMode] = useState<boolean>(true);
    const [pumpOn, setPumpOn] = useState<boolean>(false);
    const [waterLevel, setWaterLevel] = useState<number | null>(null);
    const [currentDate, setCurrentDate] = useState<string>('');

    const SOIL_MOISTURE_THRESHOLD = 30;

    useEffect(() => {
        const soilMoistureRef = ref(database, 'Soil_Moisture_Sensor');
        const manualOverrideRef = ref(database, 'manual_override');
        const systemStatusRef = ref(database, 'system_status/online');
        const weatherDataRef = ref(database, 'Temperature_Humidity_Data');
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

        const unsubscribeWaterLevel = onValue(waterLevelRef, (snapshot) => {
            const data = snapshot.val();
            const level = data !== null ? Math.round(Number(data)) : null;
            setWaterLevel(level);

            // Check and send notification if the water level is low
            if (level !== null) {
                sendWaterLevelNotification(level);
            }
        });

        const updateDate = () => {
            const now = new Date();
            const months = [
                'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'
            ];
            const day = now.getDate();
            const month = months[now.getMonth()];
            const year = now.getFullYear();
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            const seconds = now.getSeconds().toString().padStart(2, '0');
            const dateStr = `${day} ${month} ${year} ${hours}:${minutes}:${seconds}`;
            setCurrentDate(dateStr);
        };
        updateDate();
        const dateInterval = setInterval(updateDate, 1000);

        return () => {
            unsubscribeSoilMoisture();
            unsubscribeManualOverride();
            unsubscribeSystemStatus();
            unsubscribeWeatherData();
            unsubscribeWaterLevel();
            clearInterval(dateInterval);
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
            setPumpOn(status);
        } catch (error: any) {
            Alert.alert('Update Error', error.message);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}> <Feather name="user" size={24} color="black" /> Hey, Danico</Text>
                    <Text style={{ marginTop: 5, color: '#888' }}>{currentDate}</Text>
                </View>
                <TouchableOpacity onPress={handleSignOut} style={styles.logoutButton}>
                    <AntDesign name="logout" size={24} color="black" />
                </TouchableOpacity>
            </View>
            <ImageBackground
                source={backgroundImage}
                style={styles.box}
                resizeMode="cover"
            >
                <View style={styles.overlay} />
                <View style={styles.sensorDataContainer}>
                    <View style={styles.sensorItem}>
                        <FontAwesome5 name="temperature-high" size={28} color="#F4CE14" />
                        <Text style={styles.sensorValue}>
                            {temperature !== null ? `${temperature}°C` : 'Loading...'}
                        </Text>
                        <Text style={styles.sensorLabel}>Temperature</Text>
                    </View>
                    <View style={styles.sensorItem}>
                        <Ionicons name="water" size={28} color="#5DEBD7" />
                        <Text style={styles.sensorValue}>
                            {humidity !== null ? `${humidity}%` : 'Loading...'}
                        </Text>
                        <Text style={styles.sensorLabel}>Humidity</Text>
                    </View>
                    <View style={styles.sensorItem}>
                        <FontAwesome5 name="hand-holding-water" size={28} color="#C1F2B0" />
                        <Text style={styles.sensorValue}>
                            {soilMoisture !== null ? `${soilMoisture}%` : 'Loading...'}
                        </Text>
                        <Text style={styles.sensorLabel}>Soil Moisture</Text>
                    </View>
                </View>
            </ImageBackground>

            <View style={styles.plantInfoContainer}>

                <View style={styles.plantImageContainer}>
                    <Image
                        source={require('../../assets/images/source/home_1.jpg')}
                        // source={require('../../assets/images/source/home.png')}
                        style={styles.plantImage}
                    />
                </View>
                <View style={styles.plantDetailsContainer}>

                    <Text style={styles.plantTitle}>Your Plant's Status</Text>
                    <Text style={styles.plantSubtitle}>
                        Keep an eye on your plant's health with real-time data.
                    </Text>

                    <View style={styles.circularProgressContainer}>
                        <View style={styles.circularProgressRow}>
                            <CircularProgress
                                value={soilMoisture !== null ? soilMoisture : 0}
                                maxValue={100}
                                radius={50}
                                valueSuffix="%"
                                title="Soil Moisture"
                                titleColor="#000"
                                titleStyle={styles.circularProgressTitle}
                                activeStrokeColor="#f39c12"
                                inActiveStrokeColor="#F8C794"
                                activeStrokeWidth={15}
                                inActiveStrokeWidth={15}
                            />

                            <CircularProgress
                                value={temperature !== null ? temperature : 0}
                                maxValue={100}
                                radius={50}
                                valueSuffix="%"
                                title="Temperature"
                                titleColor="#000"
                                titleStyle={styles.circularProgressTitle}
                                activeStrokeColor="#d84315"
                                inActiveStrokeColor="#ffab91"
                                activeStrokeWidth={15}
                                inActiveStrokeWidth={15}
                            />


                        </View>

                        <View style={styles.circularProgressRow}>
                            <CircularProgress
                                value={humidity !== null ? humidity : 0}
                                maxValue={100}
                                radius={50}
                                valueSuffix="%"
                                title="Humidity"
                                titleColor="#000"
                                titleStyle={styles.circularProgressTitle}
                                activeStrokeColor="#1e88e5"
                                inActiveStrokeColor="#bbdefb"
                                activeStrokeWidth={15}
                                inActiveStrokeWidth={15}
                            />

                            <CircularProgress
                                value={waterLevel !== null ? waterLevel : 0}
                                maxValue={100}
                                radius={50}
                                valueSuffix="%"
                                title="Water Level"
                                titleColor="#000"
                                titleStyle={styles.circularProgressTitle}
                                activeStrokeColor="#43a047"
                                inActiveStrokeColor="#a5d6a7"
                                activeStrokeWidth={15}
                                inActiveStrokeWidth={15}
                            />
                        </View>
                    </View>
                </View>
            </View>

            <View style={styles.controlContainer}>
                <Text style={styles.controlTitle}>Control</Text>

                <View style={styles.switchContainer}>
                    <Text style={styles.switchLabel}>Auto Mode</Text>
                    <Switch
                        value={autoMode}
                        onValueChange={toggleAutoMode}
                        trackColor={{ false: '#767577', true: '#81b0ff' }}
                        thumbColor={autoMode ? '#f5dd4b' : '#f4f3f4'}
                    />
                </View>

                <View style={styles.pumpControlContainer}>
                    <Text style={styles.pumpLabel}>Manual Pump Control</Text>
                    <View style={styles.pumpButtons}>
                        <Pressable
                            onPress={() => handlePumpControl(true)}
                            style={[
                                styles.pumpButton,
                                pumpOn && styles.pumpButtonActive
                            ]}
                        >
                            <Text style={styles.pumpButtonText}>On</Text>
                        </Pressable>
                        <Pressable
                            onPress={() => handlePumpControl(false)}
                            style={[
                                styles.pumpButton,
                                !pumpOn && styles.pumpButtonInactive
                            ]}
                        >
                            <Text style={styles.pumpButtonText}>Off</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
        backgroundColor: '#F9F9F9',
        elevation: 2,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    logoutButton: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    box: {
        marginHorizontal: 20,
        padding: 20,
        borderRadius: 20,
        marginVertical: 10,
        elevation: 2,
        backgroundColor: '#F9F9F9',
        overflow: 'hidden',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    sensorDataContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    sensorItem: {
        alignItems: 'center',
    },
    sensorValue: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 10,
        color: '#fff',
    },
    sensorLabel: {
        fontSize: 14,
        color: '#ccc',
        marginTop: 5,
    },
    plantInfoContainer: {
        flexDirection: 'row',
        marginVertical: 20,
        paddingHorizontal: 20,
    },
    plantImageContainer: {
        flex: 1,
        marginTop: 150
    },
    plantImage: {
        width: 'auto',
        height: 170,
        borderRadius: 10,
    },
    plantDetailsContainer: {
        flex: 2,
        marginLeft: 20,
    },
    plantTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 30,
    },
    plantSubtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 15,
        marginTop: 5,
    },
    circularProgressContainer: {
        flexDirection: 'column',
    },
    circularProgressRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    circularProgressTitle: {
        fontSize: 14,
    },
    controlContainer: {
        marginVertical: 20,
        paddingHorizontal: 20,
    },
    controlTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    switchLabel: {
        fontSize: 16,
        color: '#333',
    },
    pumpControlContainer: {
        marginBottom: 20,
    },
    pumpLabel: {
        fontSize: 16,
        color: '#333',
        marginBottom: 10,
    },
    pumpButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    pumpButton: {
        flex: 1,
        paddingVertical: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        marginHorizontal: 5,
        backgroundColor: '#e0e0e0',
    },
    pumpButtonText: {
        fontSize: 16,
        color: '#333',
    },
    pumpButtonActive: {
        backgroundColor: '#81c784',
    },
    pumpButtonInactive: {
        backgroundColor: '#e57373',
    },
});

export default Plant;
