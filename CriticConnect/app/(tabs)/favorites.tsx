import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from '@expo/vector-icons';
import WebNavBar from './WebNavBar';
import PhoneNavBar from './PhoneNavBar';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StarRating from '@/components/StarRating';
import { fetchPostById, updatePost } from '@/utils/posts';

const SelectFavorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [hasFavorites, setHasFavorites] = useState(false);
  const [selectedSort, setSelectedSort] = useState('newest');
  const [likedState, setLikedState] = useState<{ [key: number]: boolean }>({});
  const [user, setUser] = useState<User | null>(null);
// Function to fetch user's current favorite topics from the favorites table
const fetchUserFavorites = async () => {
  try {
    const storedFavorites = await AsyncStorage.getItem('favorites');
    if (storedFavorites) {
      const parsedFavorites = JSON.parse(storedFavorites);
      console.log("User favorites fetched from AsyncStorage:", parsedFavorites);
      setFavorites(parsedFavorites);
      setHasFavorites(parsedFavorites.length > 0);
    } else {
      console.log("No favorites found in AsyncStorage.");
      setHasFavorites(false);
    }
  } catch (error) {
    console.error("Error retrieving user favorites from AsyncStorage:", error);
  }
};

// Function to update the favorites state when a button is pressed
const toggleFavorite = (topic) => {
  console.log(topic);
  
  setFavorites((prevFavorites) => {
    if (prevFavorites.includes(topic)) {
      return prevFavorites.filter(fav => fav !== topic);
    } else {
      return [...prevFavorites, topic];
    }
  });
};

// Function to submit the updated favorites back to the server
const submitFavorites = async () => {
  try {

   console.log(favorites);
   
    await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
    setHasFavorites(true);
    console.log("Favorites successfully submitted:", favorites);
  } catch (error) {
    console.error("Error submitting favorites:", error);
  }
};

const sortPosts = (sortOption: string) => {
  let sortedPosts = [...posts];
  switch (sortOption) {
    case 'newest':
      sortedPosts.sort((a, b) => b.timestamp - a.timestamp);
      break;
    case 'oldest':
      sortedPosts.sort((a, b) => a.timestamp - b.timestamp);
      break;
    case 'most-liked':
      sortedPosts.sort((a, b) => b.upvotes - a.upvotes);
      break;
    case 'rating':
      sortedPosts.sort((a, b) => b.rating - (a.rating));
      break;
    default:
      break;
  }
  setPosts(sortedPosts);
  setSelectedSort(sortOption);
};


// Clear favorites to allow updating
const clearFavorites = async () => {
  try {
    await AsyncStorage.removeItem('favorites');
    setFavorites([]);
    setHasFavorites(false);
  } catch (error) {
    console.error("Error clearing favorites:", error);
  }
};

const fetchSubjects = async () => {
  try {
    const response = await fetch(
      "https://criticconnect-386d21b2b7d1.herokuapp.com/api/subjects",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    console.log(data);
    setSubjects(data);
    
  } catch (error) {
    console.error("Error fetching subjects:", error);
  }
};

const renderSubjectsByType = (type) => {
  const filteredSubjects = subjects.filter((subject) => subject.type === type);
  return (
    <View key={type} style={styles.typeContainer}>
      <Text style={styles.typeHeader}>{type}</Text>
      {filteredSubjects.map((subject) => (
        <TouchableOpacity
          key={subject.subjectId}
          style={[
            styles.button,
            favorites.includes(subject.title) ? styles.buttonActive : styles.buttonInactive,
          ]}
          onPress={() => toggleFavorite(subject.title)}
        >
          <Text style={styles.buttonText}>
            {favorites.includes(subject.title)
              ? `- ${subject.title}`
              : `+ ${subject.title}`}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};


// Fetch all posts
const fetchPosts = async () => {
  try {
    const response = await fetch('https://criticconnect-386d21b2b7d1.herokuapp.com/api/posts', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors',
    });
    const data = await response.json();
    console.log("Fetched posts:", data);

    const formattedData = data.map((post) => ({
      id: post.postId,
      title: post.title,
      author: post.user?.username || "Deleted User",
      content: post.content,
      topic: post.subject?.type || "General",
      upvotes: post.likes || 0,
      comments: post.comments?.length || 0,
      timestamp: new Date(post.datetime),
      timeAgo: moment(post.datetime).fromNow(),
      rating: post.dislikes,
      liked: false,
      subjectTitle: post.subject?.title || "General",
    }));
    setPosts(formattedData);
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
};
  // Filter posts based on user's favorites
  const filterPostsByFavorites = () => {
    const filtered = posts.filter((post) => favorites.includes(post.subjectTitle));
    setFilteredPosts(filtered);
  };

  const handleLike = async (postId: number, liked: boolean) => {
    try {
      const post = await fetchPostById(postId);
      console.log(post.likes, liked);
  
      let curLikes = post.likes;
      if (curLikes == null) {
        curLikes = 1;
      } else {
        curLikes += liked ? -1 : 1;
      }

      const updatedPost = {
        ...post,
        likes: curLikes,
      };
  
      await updatePost(postId, updatedPost);
  
      fetchPosts();
  
      setLikedState((prev) => ({
        ...prev,
        [postId]: !liked,
      }));
    } catch (error) {
      console.error(`Error handling like for post ID ${postId}:`, error);
    }
  };
  const fetchUserData = async () => {
    try {
      // Get userId from AsyncStorage
      const userId = await AsyncStorage.getItem('userId');

      if (!userId) {
        console.error("No user ID found in AsyncStorage");
        setUser(null);
        return;
      }

      // Fetch user data by ID
      const response = await fetch(`https://criticconnect-386d21b2b7d1.herokuapp.com/api/users/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
      });

      if (!response.ok) {
        throw new Error(`Error fetching user data: ${response.status}`);
      }

      const userData = await response.json();

      console.log("User data fetched:", userData);
      setUser(userData);
    } catch (error) {
      console.error("Error retrieving user data:", error);
    }
  };

  // Fetch the user's favorites when the component mounts
  useEffect(() => {
      fetchUserData();
      fetchUserFavorites();
      fetchSubjects();
      fetchPosts();
  }, []);

  useEffect(() => {
    if (posts.length > 0 && favorites.length > 0) {
      filterPostsByFavorites();
    }
  }, [posts, favorites]);

  return (
    <View>
      {Platform.OS === 'web' ? (
        <WebNavBar username={user?.username} />
      ) : (
        <PhoneNavBar username={user?.username} />
      )}
      <View style={styles.container}>
        {hasFavorites ? (
          <>
            {/* Header for Favorite Subjects */}
            <View style={styles.favoritesContainer}>
              <Text style={styles.header}>Your Favorite Subjects:</Text>
              <Text style={styles.favoritesList}>
                {favorites.length > 0 ? favorites.join(' - ') : 'No favorites saved.'}
              </Text>
              <TouchableOpacity style={styles.button} onPress={clearFavorites}>
                <Text style={styles.buttonText}>Update Favorites</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.sortContainer}>
              <Text style={{ fontSize: 16 }}>Sort by </Text>
              {/* <Picker
                selectedValue={selectedSort}
                style={{ height: 50, width: 150 }}
                onValueChange={(itemValue) => sortPosts(itemValue)}
              >
                <Picker.Item label="Newest" value="newest" />
                <Picker.Item label="Oldest" value="oldest" />
                <Picker.Item label="Most Liked" value="most-liked" />
                <Picker.Item label="Rating" value="rating" />
              </Picker> */}
            </View>

            {/* Feed of Posts */}
            <ScrollView style={styles.content}>
              {filteredPosts.length === 0 ? (
                <Text style={styles.noPosts}>No posts match your favorites</Text>
              ) : (
                filteredPosts.map((post) => (
                  <View key={post.id} style={styles.post}>
                    <View style={styles.postContent}>
                      <View style={styles.postDetails}>
                        <Text style={styles.postMeta}>
                          {post.topic} • {post.subjectTitle} • Posted by {post.author} {post.timeAgo}
                        </Text>
                        <Text style={styles.postTitle}>{post.title}</Text>
                        <Text style={styles.postContentText}>{post.content}</Text>
                        <View style={{ marginTop: 8 }}>
                          <StarRating rating={post.rating} />
                        </View>
                        <View style={styles.postActions}>
                          <TouchableOpacity
                            style={[styles.actionButton, likedState[post.id] && styles.likedButton]}
                            onPress={() => handleLike(post.id, likedState[post.id] || false)}
                          >
                            <Ionicons
                              name="thumbs-up-outline"
                              size={16}
                              color={likedState[post.id] ? 'blue' : 'gray'}
                            />
                            <Text style={[styles.actionText, likedState[post.id] && { color: 'blue' }]}>
                              {post.upvotes} Likes
                            </Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => {
                              router.push(`/comments?post=${post.id}`);
                            }}
                          >
                            <Ionicons name="chatbubble-outline" size={16} color="gray" />
                            <Text style={styles.actionText}>{post.comments} Comments</Text>
                          </TouchableOpacity>
                          {/* <TouchableOpacity style={styles.actionButton}>
                            <Ionicons name="share-outline" size={16} color="gray" />
                            <Text style={styles.actionText}>Share</Text>
                          </TouchableOpacity> */}
                        </View>
                      </View>
                    </View>
                  </View>
                ))
              )}
            </ScrollView>
          </>
        ) : (
          <>
            <Text style={styles.header}>Select your favorite topics here!</Text>
            <ScrollView horizontal style={styles.horizontalScrollView}>
              {renderSubjectsByType('Film')}
              {renderSubjectsByType('Book')}
              {renderSubjectsByType('Video_Game')}
            </ScrollView>
            <TouchableOpacity style={styles.submitButton} onPress={submitFavorites}>
              <Text style={styles.buttonText}>Submit Favorites</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexWrap: 'wrap',
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeContainer: {
    marginBottom: 20,
  },
  typeHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonActive: {
    backgroundColor: 'green',
  },
  buttonInactive: {
    backgroundColor: '#007bff',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  favoritesContainer: {
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  favoritesList: {
    fontSize: 16,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 16,
  },
  content: {
    flex: 1,
    width: '100%',
  },
  post: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 16,
  },
  postContent: {
    flexDirection: 'column',
  },
  postDetails: {
    marginBottom: 10,
  },
  postMeta: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 5,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  postContentText: {
    fontSize: 16,
    color: '#495057',
    marginBottom: 10,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e9ecef',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  actionText: {
    fontSize: 14,
    marginLeft: 5,
  },
  likedButton: {
    backgroundColor: '#d1e7dd',
  },
  noPosts: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    marginTop: 20,
  },
  horizontalScrollView: {
    marginVertical: 15,
    paddingHorizontal: 10,
  },
  submitButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginTop: 20,
    alignSelf: 'center',
  },
});

export default SelectFavorites;