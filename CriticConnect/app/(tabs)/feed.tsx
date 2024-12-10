import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import {Picker} from "@react-native-picker/picker";
import { Ionicons } from '@expo/vector-icons';
import WebNavBar from './WebNavBar';
import PhoneNavBar from './PhoneNavBar';
import moment from 'moment';
import { router, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import StarRating from '@/components/StarRating';
import { fetchPostById, updatePost } from '@/utils/posts';


// Define the Post interface
interface Post {
  id: number;
  title: string;
  author: string;
  content: string;
  topic: string;
  upvotes: number;
  comments: number;
  timestamp: Date;
  timeAgo: string;
  rating: number;
  liked: boolean;
  subjectTitle: string;
}

const Feed = () => {
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedSort, setSelectedSort] = useState('newest');
  const [user, setUser] = useState<User | null>(null);
  const [likedState, setLikedState] = useState<{ [key: number]: boolean }>({}); 
  const [dropdownVisible, setDropdownVisible] = useState(false);

  interface User {
    username: string;
  }

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
      console.log("Fetched data:", data);

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

  useFocusEffect(
    React.useCallback(() => {

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

      fetchPosts();
      fetchUserData();
    }, [])
  );


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

  return (
    <View style={styles.container}>
      {Platform.OS === 'web' ? (
      <WebNavBar username={user?.username} />
      ) : (
      <PhoneNavBar username={user?.username} />
      )}
      <ScrollView style={styles.content}>
        <View style={styles.sortContainer}>
            <TouchableOpacity onPress={() => setDropdownVisible(!dropdownVisible)} style={styles.sortButton}>
              <Text style={styles.sortButtonText}>Sort by: {selectedSort}</Text>
              <Ionicons name="chevron-down-outline" size={16} color="black" />
            </TouchableOpacity>
            {dropdownVisible && (
              <View style={styles.dropdown}>
                <TouchableOpacity style={styles.dropdownOption} onPress={() => sortPosts('newest')}>
                  <Text style={styles.dropdownText}>Newest</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.dropdownOption} onPress={() => sortPosts('oldest')}>
                  <Text style={styles.dropdownText}>Oldest</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.dropdownOption} onPress={() => sortPosts('most-liked')}>
                  <Text style={styles.dropdownText}>Most Liked</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.dropdownOption} onPress={() => sortPosts('rating')}>
                  <Text style={styles.dropdownText}>Rating</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        <View style={styles.postsContainer}>
        {posts.length === 0 ? (
          <Text>No posts available</Text>
        ) : (
          posts.map((post) => (
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
   
                    <TouchableOpacity style={styles.actionButton} 
                      onPress={() => {
                        router.push(`/comments?post=${post.id}`);
                      }}>
                      <Ionicons name="chatbubble-outline" size={16} color="gray" />
                      <Text style={styles.actionText}>{post.comments} Comments</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                      <Ionicons name="share-outline" size={16} color="gray" />
                      <Text style={styles.actionText}>Share</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                      <Ionicons name="bookmark-outline" size={16} color="gray" />
                      <Text style={styles.actionText}>Save</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          ))
        )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sortContainer: {
    marginBottom: 16,
    position:'relative',
    zIndex: 1,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
  },
  sortButtonText: {
    fontSize: 16,
    marginRight: 8,
  },
  dropdown: {
    position: 'absolute',
    top: 50,
    left: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    zIndex: 1000,
  },
  dropdownOption: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  dropdownText: {
    fontSize: 16,
  },
  postsContainer: {
    width: '100%',
  },
  post: {
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 16,
    padding: 16,
  },
  postContent: {
    flexDirection: 'row',
  },
  postContentText: {
    fontSize: 14,
    color: 'black',
    marginTop: 8,
    marginBottom: 8,
    lineHeight: 20,
  },
  voteContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginRight: 16,
  },
  iconButton: {
    padding: 8,
  },
  voteCount: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  postDetails: {
    flex: 1,
  },
  postMeta: {
    fontSize: 12,
    color: 'gray',
    marginBottom: 4,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  postActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  actionText: {
    fontSize: 12,
    color: 'gray',
    marginLeft: 4,
  },
  likedButton: {
    borderColor: 'blue',
  },
});

export default Feed;