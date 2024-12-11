import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { router } from 'expo-router';

const home = () => {
    return (
        <ImageBackground
            source={{
                uri: 'criticConnectImage.png',
            }}
            resizeMode="cover"
            style={styles.background}
        >
            <View style={styles.overlay} />
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <Text style={styles.headerText}>CriticConnect</Text>
                </View>
                <View style={styles.formContainer}>
                    <Text style={styles.welcomeText}>Welcome to CriticConnect!</Text>
                    <Text style={styles.subText}>
                        Dive into the world of reviews for movies, games, and music.
                    </Text>
                    <TouchableOpacity
                        style={styles.getStartedButton}
                        onPress={() => router.push('/signup')}
                    >
                        <Text style={styles.getStartedText}>Get Started</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.footerContainer}>
                    <Text style={styles.footerText}>
                        "Your next favorite discovery is just a review away."
                    </Text>
                </View>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    headerContainer: {
        position: 'absolute',
        top: 60,
        alignItems: 'center',
    },
    headerText: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#fff',
    },
    formContainer: {
        width: '90%',
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 7,
        elevation: 6,
        alignItems: 'center',
    },
    welcomeText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#222',
        textAlign: 'center',
        marginBottom: 8,
    },
    subText: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
        marginBottom: 20,
    },
    getStartedButton: {
        backgroundColor: '#007bff',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 25,
        shadowColor: '#007bff',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
    },
    getStartedText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    footerContainer: {
        position: 'absolute',
        bottom: 30,
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    footerText: {
        fontSize: 16,
        color: '#fff',
        fontStyle: 'italic',
        textAlign: 'center',
    },
});

export default home;