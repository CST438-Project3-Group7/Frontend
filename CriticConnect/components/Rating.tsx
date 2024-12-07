import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

interface RatingProps {
  rating: number;
  onChange: (rating: number) => void;
}

const Rating: React.FC<RatingProps> = ({ rating, onChange }) => {
  return (
    <View style={styles.ratingContainer}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity key={star} onPress={() => onChange(star)}>
          <Text style={[styles.star, rating >= star && styles.selectedStar]}>
            ★
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  ratingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  star: {
    fontSize: 30,
    color: "#ccc",
    marginHorizontal: 5,
  },
  selectedStar: {
    color: "#FFD700", // gold color for stars
  },
});

export default Rating;