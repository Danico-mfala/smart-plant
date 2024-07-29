import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';

const Plant = () => {
    const [plantName, setPlantName] = useState('');
    const [waterAmount, setWaterAmount] = useState('');
    const [plantStatus, setPlantStatus] = useState('');
    const router = useRouter();

    useEffect(() => {
        // Fetch initial data from Firebase or another API
        // fetchPlantData();
        // Danico don't forget to send the data to the data base and receive
        // data 1 : temperature , humidit etc .
        // data 2 : water level and water from sensor
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.push('Login')
        } catch (error) {
            Alert.alert('Logout Error', error.message);
        }
    };

    const handleWaterPlant = () => {
        // function to handle watering the plant
        Alert.alert('Water Plant', `Watering the plant with ${waterAmount} amount.`);
    };

    const handleUpdatePlant = () => {
        // function to update plant information
        Alert.alert('Update Plant', `Updating plant name to ${plantName}.`);
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Plant Dashboard</Text>
            <Text style={styles.sectionTitle}>Plant Information</Text>
            <View style={styles.infoContainer}>
                <Text style={styles.label}>Plant Name:</Text>
                <TextInput
                    style={styles.input}
                    value={plantName}
                    onChangeText={setPlantName}
                    placeholder="Enter plant name"
                />
                <Text style={styles.label}>Plant Status:</Text>
                <Text style={styles.status}>{plantStatus || 'No status available'}</Text>
            </View>
            <Text style={styles.sectionTitle}>Watering Controls</Text>
            <View style={styles.controlContainer}>
                <Text style={styles.label}>Amount of Water:</Text>
                <TextInput
                    style={styles.input}
                    value={waterAmount}
                    onChangeText={setWaterAmount}
                    placeholder="Enter amount of water"
                    keyboardType="numeric"
                />
                <Button title="Water Plant" onPress={handleWaterPlant} />
            </View>
            <TouchableOpacity style={styles.updateButton} onPress={handleUpdatePlant}>
                <Text style={styles.updateButtonText}>Update Plant Info</Text>
            </TouchableOpacity>
            <Button title="Logout" onPress={handleLogout} />
        </ScrollView>
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
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    infoContainer: {
        width: '100%',
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#399918',
    },
    controlContainer: {
        width: '100%',
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#399918   ',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    input: {
        width: '100%',
        height: 40,
        backgroundColor: '#fff',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#399918',
    },
    status: {
        fontSize: 16,
        marginBottom: 15,
    },
    updateButton: {
        backgroundColor: '#399918',
        borderRadius: 5,
        padding: 10,
        marginBottom: 20,
    },
    updateButtonText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
    },
});

export default Plant;
