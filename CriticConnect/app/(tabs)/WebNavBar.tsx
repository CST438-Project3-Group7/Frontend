import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {router} from 'expo-router';


const WebNavBar = ({username}) => {
    const [activeCategory, setActiveCategory] = useState('feed');

    return (
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.navContainer}>
                <TouchableOpacity style={[styles.logoContainer, activeCategory === 'feed' && styles.logoContainer]} onPress={() => setActiveCategory('feed')}>
                    <Text style={styles.logoText}>CriticConnect</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.catButton, activeCategory === 'games' && styles.activeCatButton]} onPress={() => setActiveCategory('games')}>
                    <Text>Games</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.catButton, activeCategory === 'movies' && styles.activeCatButton]} 
                    onPress={() => setActiveCategory('movies')}>
                    <Text>Movies</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.catButton, activeCategory === 'music' && styles.activeCatButton]} 
                    onPress={() => setActiveCategory('music')}>
                    <Text>Music</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.searchContainer}>
                <TextInput style={styles.searchInput} placeholder="Search CriticConnect"/>
            </View>
            <View style={styles.navContainer}>
                <TouchableOpacity style={styles.profileButton}>
                    <View style={styles.profileIcon} />
                    <Text style={styles.profileText}>{username}</Text>
                    <Ionicons name="chevron-down-outline" size={16} color="black" />
                </TouchableOpacity>
            </View>
        </View>
      </View>
    );
};
const styles = StyleSheet.create({
    header: {
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        paddingVertical: 10,
        paddingHorizontal: 20,
      },
      headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        spaceX: 2,
      },
      logoText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'green',
        marginLeft: 8,
      },
      searchContainer: {
        flex: 1,
        marginLeft: 16,
      },
      searchInput: {
        backgroundColor: '#f1f1f1',
        borderRadius: 8,
        paddingHorizontal: 10,
        height: 40,
      },
      navContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 16,
      },
      catButton: {
        marginHorizontal: 8,
      },
      activeCatButton: {
        borderBottomWidth: 2,
        borderColor: 'green',
      },
      profileButton: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginLeft: 8,
      },
      profileIcon: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#ccc',
        marginRight: 8,
      },
      profileText: {
        fontSize: 16,
        marginRight: 4,
      },
});

export default WebNavBar;