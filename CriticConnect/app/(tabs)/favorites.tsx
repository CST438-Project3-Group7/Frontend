import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const SelectFavorites = () => {
  const [favorites, setFavorites] = useState([]);

  // Function to fetch user's current favorite topics from the favorites table
  const fetchUserFavorites = async () => {
    try {

      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        console.error("No user ID found in AsyncStorage");
        return;
      }
      const response = await fetch(`https://criticconnect-386d21b2b7d1.herokuapp.com/api/favorites/user/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
      });

      if (!response.ok) {
        throw new Error(`Error fetching favorites: ${response.status}`);
      }

      const data = await response.json();
  
      console.log("User favorites fetched:", data);
      return data
    } catch (error) {
      console.error("Error retrieving user favorites:", error);
    }
  };

  // Function to update the favorites state when a button is pressed
  const addToFavorites = (topic) => {
    setFavorites((prevFavorites) => {
      // Avoid adding duplicates
      if (!prevFavorites.includes(topic)) {
        return [...prevFavorites, topic];
      }
      return prevFavorites;
    });
  };

  // Function to submit the updated favorites back to the server
  const submitFavorites = async () => {
    try {
      // First, delete the existing favorites for the user
      await fetch(`https://criticconnect-386d21b2b7d1.herokuapp.com/api/favorites/delete/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
      });

      // Then, insert the updated favorites into the database
      const response = await fetch(`https://criticconnect-386d21b2b7d1.herokuapp.com/api/favorites/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          favorites: favorites,
        }),
        mode: 'cors',
      });

      if (!response.ok) {
        throw new Error(`Error submitting favorites: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        alert('Favorites updated successfully!');
      } else {
        alert('Failed to update favorites');
      }
    } catch (error) {
      console.error("Error submitting favorites:", error);
    }
  };

  // Fetch the user's favorites when the component mounts
  useEffect(() => {
      fetchUserFavorites();

  }, []);



  return (
    <View style={styles.container}>
      <Text style={styles.header}>Select your favorite topics here!</Text>

      {/* Buttons to add topics to favorites */}
      <TouchableOpacity style={styles.button} onPress={() => addToFavorites('Film')}>
        <Text style={styles.buttonText}>Add Film to Favorites</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => addToFavorites('Games')}>
        <Text style={styles.buttonText}>Add Games to Favorites</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => addToFavorites('Music')}>
        <Text style={styles.buttonText}>Add Music to Favorites</Text>
      </TouchableOpacity>

      {/* Display the list of favorite topics */}
      <Text style={styles.favoritesHeader}>Your Favorite Topics:</Text>
      <Text style={styles.favoritesList}>
        {favorites.length > 0 ? favorites.join(', ') : 'No favorites yet'}
      </Text>

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={submitFavorites}>
        <Text style={styles.buttonText}>Submit Favorites</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: 'gray',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 10,
  },
  submitButton: {
    backgroundColor: 'blue', // Different color for submit button
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  favoritesHeader: {
    fontSize: 18,
    marginTop: 20,
    fontWeight: 'bold',
  },
  favoritesList: {
    fontSize: 16,
    color: 'gray',
    marginTop: 10,
  },
});

export default SelectFavorites;
