import { Alert } from 'react-native';

export const sendWaterLevelNotification = (waterLevel: number, threshold: number = 20) => {
    if (waterLevel < threshold) {
        Alert.alert(
            'Low Water Level',
            'The water level in the reservoir is low. Please refill the tank to ensure your plant is watered properly.',
            [{ text: 'OK' }]
        );
    }
};  