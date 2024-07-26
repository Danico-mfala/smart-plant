import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';

interface CustomBottomProps {
    onPress: () => void;
    title: string;
    textStyles?: string;
    containerStyles?: string;
}

const CustomBottom = ({ onPress, title, textStyles = "", containerStyles = "" }: CustomBottomProps) => {
    return (
        <TouchableOpacity activeOpacity={0.7}>
            <Text>{title}</Text>
        </TouchableOpacity>
    )
}

export default CustomBottom;