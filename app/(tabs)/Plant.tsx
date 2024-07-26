import { StyleSheet, View, Text } from 'react-native'
import React from 'react'

const Plant = () => {
    return (
        <View style={styles.container}>
            <Text>plant</Text>
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

export default Plant