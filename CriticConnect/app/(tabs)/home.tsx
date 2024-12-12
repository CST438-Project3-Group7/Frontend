import React,  { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { getUserInfoDb } from '../../components/DbFunc';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Home = () => {
    const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId:'973280850643-799591b5eq02v6gcqsp59jneh22atura.apps.googleusercontent.com',
    androidClientId:'973280850643-qcntidlb6onkpao1mkqovo0ugtku336h.apps.googleusercontent.com',
    iosClientId: '',
    scopes: ['profile', 'email'],
    });
    async function handleGoogleSignIn() {
    let user = await AsyncStorage.getItem("@user");
    console.log("local storage currently has: ", JSON.parse(user));
    // if the user hasnt signed in
    if(!user)
    {
        if(response?.type === "success")
        {
        await getGoogleInfo(response.authentication?.accessToken);
        user = await AsyncStorage.getItem("@user");
        user = JSON.parse(user);
        console.log('user info for checking the database is ', user);
        let check = await getUserInfoDb(user.id);
        console.log("user info is", check)
        if(check == null) {
            // user doesnt exist in our db
            // router.push('/signup');
            console.log("User data:", user);
            console.log("User token, user does not exists if statement", user.accessToken);
        }
        else {
            // user exists
            await AsyncStorage.setItem("@user", JSON.stringify(check));
            // router.push('/feed');
            console.log("User data:", user);
            console.log("User token, user exists if statement", data.accessToken);
        }

        }else{
        //auto log in if the user exists in our database as a normal user
        console.log("Google sign in failed");
        }
    }
    else
    {
        // if the user has signed in
        // router.push('/feed');
    }
    }

    const getGoogleInfo = async (token: string | undefined) => {
    if(!token) return;
    console.log("attempting to fetch");
    try {
        const response = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
            headers: {Authorization: `Bearer ${token}`},
        }
        );
        console.log("post fetch");
        let user = await response.json();
        console.log("post json change")
        user.username = 'none';
        await AsyncStorage.setItem("@user", JSON.stringify(user));
    } catch(error){
        // error handler
    }
    };
    const checkAlreadyLoggedIn = async () => {
    let user = await AsyncStorage.getItem("userId");
    console.log("local storage currently has: ", JSON.parse(user));
    if(user)
    {
        router.push('/feed');
    }
    }
    React.useEffect(() => {
        checkAlreadyLoggedIn();
        handleGoogleSignIn();
      }, [response]);

    return (
        <ImageBackground
            source={require('../../assets/images/criticConnectImage.png')}
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

export default Home;