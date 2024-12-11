import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Picker } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import WebNavBar from '../WebNavBar';
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
      <WebNavBar username={user?.username || "Guest"} />
      <ScrollView style={styles.content}>
        
        <View style={styles.sortContainer}>
          <Text style={{ fontSize: 16}}>Sort by    </Text>
          <Picker
            selectedValue={selectedSort}
            style={{ height: 50, width: 150 }}
            onValueChange={(itemValue) => sortPosts(itemValue)}
          >
            <Picker.Item label="Newest" value="newest" />
            <Picker.Item label="Oldest" value="oldest" />
            <Picker.Item label="Most Liked" value="most-liked" />
            <Picker.Item label="Rating" value="rating" />
          </Picker>
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
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    padding: 20,
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
  postsContainer: {
    width: '100%',
  },
  post: {
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
    marginBottom: 16,
    padding: 20,
  },
  postContent: {
    flexDirection: 'column',
  },
  postContentText: {
    fontSize: 14,
    color: '#495057',
    marginTop: 8,
    marginBottom: 8,
    lineHeight: 22,
  },
  postDetails: {
    flex: 1,
  },
  postMeta: {
    fontSize: 13,
    color: '#6c757d',
    marginBottom: 8,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#343a40',
    marginBottom: 10,
  },
  postActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#e9ecef',
    marginRight: 8,
  },
  actionText: {
    fontSize: 12,
    color: '#495057',
    marginLeft: 6,
  },
  likedButton: {
    backgroundColor: '#d1e7ff',
  },
  noPosts: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default Feed;