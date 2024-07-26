import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

const login = () => {
    return (
        <View style={styles.container}>
            <Text>login</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});

export default login