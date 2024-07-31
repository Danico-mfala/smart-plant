import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';

interface CustomBottomProps {
    onPress: () => void;
    title: string;
    textStyles?: string;
    containerStyles?: string;
}

const CustomBottom = ({
    onPress,
    title,
    textStyles = "",
    containerStyles = "" }: CustomBottomProps) => {
    return (
        <TouchableOpacity
            style={styles.button}
            activeOpacity={0.7}
            onPress={onPress}
        >
            <Text style={styles.title}>{title}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        width: 270,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#59CE8F',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white'
    }
});

export default CustomBottom;