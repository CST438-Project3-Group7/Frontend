import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Modal, TextInput, Button, TouchableOpacity, Pressable,Platform } from 'react-native';
import { useLocalSearchParams, useFocusEffect, router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WebNavBar from './WebNavBar';
import PhoneNavBar from './PhoneNavBar';

const Comments = () => {
  const { post } = useLocalSearchParams(); // Retrieve postId from query string
  const [comments, setComments] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [user, setUser] = useState(null);
  const [postData, setPostData] = useState(null);

  // Fetch user data from AsyncStorage and backend API
  const fetchUser = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        console.error('No user ID found in AsyncStorage');
        return;
      }
      const response = await fetch(`https://criticconnect-386d21b2b7d1.herokuapp.com/api/users/${userId}`);
      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  // Fetch post details
  const fetchPostDetails = async () => {
    try {
      const response = await fetch(`https://criticconnect-386d21b2b7d1.herokuapp.com/api/posts/${post}`);
      const data = await response.json();
      setPostData(data);
    } catch (error) {
      console.error('Error fetching post details:', error);
    }
  };

  // Fetch comments for the post
  const fetchComments = async () => {
    try {
      const response = await fetch(`https://criticconnect-386d21b2b7d1.herokuapp.com/api/comments/post/${post}`);
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  // Combine all fetches on mount
  useFocusEffect(
    React.useCallback(() => {
      if (post) {
        fetchComments();
        fetchPostDetails();
        fetchUser();
      }
    }, [post])
  );

  // Handle posting a new comment
  const handlePostComment = async () => {
    if (!user || !newComment.trim() || !postData) {
      alert('Ensure all data is loaded and you have entered a comment.');
      return;
    }

    const newCommentData = {
      content: newComment,
      likes: 0,
      dislikes: 0,
      user: user, // User data fetched earlier
      datetime: new Date().toISOString(),
      post: postData, // Post data fetched earlier
    };

    try {
      const response = await fetch(`https://criticconnect-386d21b2b7d1.herokuapp.com/api/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCommentData),
      });

      if (!response.ok) {
        throw new Error('Failed to post comment');
      }

      const postedComment = await response.json();
      setComments([...comments, postedComment]); // Update comments list
      setNewComment('');
      setModalVisible(false); // Close the modal
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {Platform.OS === 'web' ? (
      <WebNavBar username={user?.username} />
      ) : (
      <PhoneNavBar username={user?.username} />
      )}
     <Pressable onPress={() => router.push("/feed")} style={styles.backButton}>
        <Text style={styles.backButtonText}>Back</Text>
    </Pressable>
      <ScrollView style={styles.container}>
        {/* Display the Post details */}
        {postData && (
          <View style={styles.postContainer}>
            <Text style={styles.postTitle}>{postData.title}</Text>
            <Text style={styles.postAuthor}>By: {postData.user.username} {postData.datetime}</Text>
            <Text style={styles.postContent}>{postData.content}</Text>
          </View>
        )}

        {/* Display Comments */}
        {comments.length === 0 ? (
          <Text>No comments available</Text>
        ) : (
          comments.map((comment) => (
            <View key={comment.commentId} style={styles.comment}>
              <Text style={styles.author}>User: {comment.user.username}</Text>
              <Text style={styles.author}>Date: {comment.datetime}</Text>
              <Text style={styles.content}>{comment.content}</Text>
            </View>
          ))
        )}
      </ScrollView>

      {/* Button to Open Modal */}
      <TouchableOpacity
        style={styles.commentButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.commentButtonText}>Comment</Text>
      </TouchableOpacity>

      {/* Modal for Posting a Comment */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Write a Comment</Text>
            <TextInput
              style={styles.input}
              placeholder="Write your comment here..."
              value={newComment}
              onChangeText={setNewComment}
            />
            <View style={styles.modalButtons}>
              <Button title="Post" onPress={handlePostComment} />
              <Button title="Cancel" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  postContainer: {
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  postAuthor: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  postContent: {
    fontSize: 16,
    color: '#333',
  },
  comment: {
    marginBottom: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  author: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  content: {
    color: '#333',
  },
  commentButton: {
    backgroundColor: '#007BFF',
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  commentButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  backButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    margin: 10,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Comments;
