import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface StarRatingProps {
  rating: number; // Number of stars (e.g., 3 out of 5)
  maxStars?: number; // Total stars to display, default is 5
}

const StarRating: React.FC<StarRatingProps> = ({ rating, maxStars = 5 }) => {
  return (
    <View style={styles.ratingContainer}>
      {[...Array(maxStars)].map((_, index) => (
        <Ionicons
          key={index}
          name={index < rating ? 'star' : 'star-outline'}
          size={16}
          color="#FFD700" // Gold color for stars
          style={styles.star}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    marginHorizontal: 2,
  },
});

export default StarRating;