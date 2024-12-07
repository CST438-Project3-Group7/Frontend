import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity,TextInput, ScrollView } from 'react-native';
import {router} from 'expo-router';

const home = () => {
    return (
        <View style={styles.container}>
            <View style={styles.formContainer}>
                <Text style={styles.label}>Welcome to CriticConnect!</Text>
                <Text style={styles.label}>Your hub for movie, game, and song reviews.</Text>
                <TouchableOpacity style={styles.submitButton} onPress={() => router.push('/signup')}>
                    <Text style={styles.submitButtonText}>Get Started</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    formContainer: {
        backgroundColor: '#f9f9f9',
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    submitButton: {
        backgroundColor: '#000',
        paddingVertical: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
export default home;