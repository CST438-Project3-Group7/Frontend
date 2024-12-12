import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Modal,Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import WebNavBar from './WebNavBar';
import PhoneNavBar from './PhoneNavBar';
import moment from 'moment';
import { router, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import StarRating from '@/components/StarRating';

interface Post {
  id: number;
  title: string;
  author: string;
  content: string;
  subreddit: string;
  upvotes: number;
  comments: number;
  timestamp: Date;
  timeAgo: string;
  rating: number;
  subject: string;
  subjectTitle: string;
}

const Profile = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedSort, setSelectedSort] = useState('newest');
  const [user, setUser] = useState<User | null>(null);
  const [profileData, setProfileData] = useState({
    newUsername: '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
    roles: 'USER',
  });
  const [dropdownVisible, setDropdownVisible] = useState(false);
  
  const handleInputChange = (field, value) => {
    setProfileData((prevData) => ({ ...prevData, [field]: value }));
  };
  
  const [deleteAccPrompt, setDeleteAccPrompt] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  

  interface User {
    id: string;
    username: string;
    password: string;
  }

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
          setUser({
            id: userData.userId,
            username: userData.username,
            password: userData.password,
          });
          console.log(user);
        } catch (error) {
          console.error("Error retrieving user data:", error);
        }
      };

      const fetchPosts = async () => {
        try {

          const userId = await AsyncStorage.getItem('userId');
          if (!userId) {
            console.error("No user ID found in AsyncStorage");
            setUser(null);
            return;
          }

          const response = await fetch(`https://criticconnect-386d21b2b7d1.herokuapp.com/api/posts/user/${userId}`, {
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
            subject: post.subject?.type || "Unknown", 
            upvotes: post.likes || 0, 
            comments: post.comments?.length || 0, 
            timestamp: new Date(post.datetime), 
            timeAgo: moment(post.datetime).fromNow(), 
            rating: post.dislikes,
            subjectTitle: post.subject?.title || "General"
          }));
      
          setPosts(formattedData);
        
        } catch (error) {
          console.error("Error fetching posts:", error);
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
        sortedPosts.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }
    setPosts(sortedPosts);
    setSelectedSort(sortOption);
  };

  const updateUser = async (updatedUser: User) => {
    try {
      const response = await fetch(`https://criticconnect-386d21b2b7d1.herokuapp.com/api/users/${updatedUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
      });
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const data = await response.json();
      alert('Profile updated successfully');
      router.push('/feed');
    } catch (error) {
      console.error(error);
      alert('An error occurred while updating the profile');
    }
  };

  const handleSave = async (user) => {
    if(profileData.currentPassword==''){
      alert('Please enter your password');
      return;
    }
    if(user.password!=profileData.currentPassword){
      console.log(`user id: ${user.id}`);
      console.log(`currentPassword: ${profileData.currentPassword}`);
      alert("Incorrect password entered");
      return;
    }
    if(profileData.newUsername==''&& profileData.newPassword==''){
      alert('No fields were changed');
      return;
    }
    if (!profileData.newUsername && !profileData.newPassword) {
      alert('No fields were changed');
      return;
    }
    
    if (profileData.newPassword && profileData.newPassword !== profileData.confirmNewPassword) {
      alert('New passwords do not match');
      return;
    }
    console.log(`passwords are good, updating profile now`)
    const updatedUser = {
      ...user,
      username: profileData.newUsername || user.username,
      password: profileData.newPassword || user.password,
      roles: profileData.roles,
    };
    
    console.log(`Profile saved: ${profileData.newUsername},${profileData.newPassword},${profileData.confirmNewPassword}`);
    await updateUser(updatedUser);
  };
  const handleDeleteAcc = async (user) => {
    try {
      const response = await fetch(`https://criticconnect-386d21b2b7d1.herokuapp.com/api/users/${user.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to delete account: ${errorData.message}`);
      }
  
      alert('Account deleted successfully');
      setIsModalVisible(false);
      setDeleteAccPrompt(false);
      router.push('/login');
    } catch (error) {
      console.error('Error deleting account:', error);
      alert(`An error occurred while deleting the account: ${error.message}`);
    }
  }

  return (
    <View style={styles.container}>
      {Platform.OS === 'web' ? (
      <WebNavBar username={user?.username || "Guest"} />
      ) : (
      <PhoneNavBar username={user?.username || "Guest"} />
      )}
      <ScrollView style={styles.content}>
          <Text style={styles.title}>{user?.username || "Guest"}'s Profile</Text>
          <TouchableOpacity style={styles.profileActions} onPress={() => router.push('/feed')}>
            <Text>Back to Feed</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileActions} onPress={() => setIsModalVisible(true)}>
            <Text style={styles.editProfileButtonText}>Edit Profile</Text>
            <Ionicons name="pencil" size={24} color="black" />
            </TouchableOpacity>
        <View style={styles.horizontalLine}/>
        <View style={styles.sortContainer}>
          <Text style={styles.title}>Posts</Text>
          <View style={styles.sortWrapper}>
            <Text style={styles.sortText}>Sort by</Text>
            <Picker
              selectedValue={selectedSort}
              style={styles.sortDropDown}
              onValueChange={(itemValue) => sortPosts(itemValue)}
            >
              <Picker.Item label="Newest" value="newest" />
              <Picker.Item label="Oldest" value="oldest" />
              <Picker.Item label="Most Liked" value="most-liked" />
              <Picker.Item label="Rating" value="rating" />
            </Picker>
            </View>
        </View>
        <View style={styles.postContainer}>
        {posts.length === 0 ? (
          <Text>No posts available</Text>
        ) : (
          posts.map((post) => (
            <View key={post.id} style={styles.post}>
              <View style={styles.postContent}>
                <View style={styles.postDetails}>
                  <Text style={styles.postMeta}>
                    {post.subject} •  {post.subjectTitle} • Posted by u/{post.author} {post.timeAgo}
                  </Text>
                  <Text style={styles.postTitle}>{post.title}</Text>
                  <Text style={styles.postContentText}>{post.content}</Text>
                  <View style={{ marginTop: 8 }}>
                    <StarRating rating={post.rating} />
                  </View>
                  <View style={styles.postActions}>
                    <TouchableOpacity style={styles.actionButton}>
                      <Ionicons name="thumbs-up-outline" size={16} color="gray" />
                      <Text style={styles.actionText}>{post.upvotes} Likes</Text>
                    </TouchableOpacity>
                    {/* <TouchableOpacity style={styles.actionButton}>
                      <Ionicons name="thumbs-down-outline" size={16} color="gray" />
                      <Text style={styles.actionText}>Dislike amount</Text>
                    </TouchableOpacity> */}
                    <TouchableOpacity style={styles.actionButton}
                      onPress={() => {
                        router.push(`/comments?post=${post.id}`);
                      }}>
                      <Ionicons name="chatbubble-outline" size={16} color="gray" />
                      <Text style={styles.actionText}>{post.comments} Comments</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          ))
        )}
        </View>
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalForm}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <Text>(leave username field empty to not change)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Username"
                  value={profileData.newUsername}
                  onChangeText={(value) => handleInputChange('newUsername', value)}
                  autoCompleteType="off"
                  textContentType="none"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Current Password"
                  value={profileData.currentPassword}
                  onChangeText={(value) => handleInputChange('currentPassword', value)}
                  secureTextEntry
                  autoCapitalize="none"
                  autoCompleteType="off"
                  textContentType="none"
                />
                <Text>Change Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="New Password"
                  value={profileData.newPassword}
                  onChangeText={(value) => handleInputChange('newPassword', value)}
                  secureTextEntry
                  autoCapitalize="none"
                  autoCompleteType="off"
                  textContentType="none"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Confirm Password"
                  value={profileData.confirmNewPassword}
                  onChangeText={(value) => handleInputChange('confirmNewPassword', value)}
                  secureTextEntry
                  autoCapitalize="none"
                  autoCompleteType="off"
                  textContentType="none"
                />
              </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setIsModalVisible(false)}>
                <Text style={styles.saveButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={() => handleSave(user)}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.deleteAccContainer}>
          <View style={styles.deleteAccContent}>
            <TouchableOpacity onPress={() => setDeleteAccPrompt(true)}>
              <Text style={styles.deleteAccText}>Delete Account</Text>
            </TouchableOpacity>
          </View>
          {deleteAccPrompt && (
            <View style={styles.deleteAccPrompt}>
              <Text style={styles.deleteAccPromptText}>Are you sure you want to delete your account?</Text>
              <View style={styles.deleteForm}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  value={profileData.currentPassword}
                  onChangeText={(value) => handleInputChange('currentPassword', value)}
                  secureTextEntry
                  autoCapitalize="none"
                  autoCompleteType="off"
                  textContentType="none"
                />
              </View>
              <View style={styles.deleteAccButtonContainer}>
                <TouchableOpacity style={styles.deleteAccButton1} onPress={() => { setIsModalVisible(false); setDeleteAccPrompt(false); }}>
                  <Text style={styles.deleteAccButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteAccButton2} onPress={() => handleDeleteAcc(user)}>
                  <Text style={styles.deleteAccButtonText}>Confirm</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
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
    backgroundColor: '#f7f7f7',
  },
  content: {
    flex: 1,
    paddingHorizontal: 40,
    paddingVertical: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  horizontalLine: {
    height: 2,
    backgroundColor: '#ddd',
    marginVertical: 20,
  },
  profileActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007bff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  editProfileButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
sortContainer: {
    position: 'relative',
    zIndex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
    marginBottom: 20,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortText: {
    fontSize: 16,
    color: '#555',
    marginRight: 10,
  },
  sortDropDown: {
    height: 40,
    width: 150,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    backgroundColor: '#f9f9f9',
  },
  postContainer: {
    marginTop: 20,
  },
  post: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  postContent: {
    flexDirection: 'row',
  },
  postContentText: {
    fontSize: 14,
    color: '#333',
    marginTop: 8,
    marginBottom: 8,
    lineHeight: 20,
  },
  postMeta: {
    fontSize: 12,
    color: '#777',
    marginBottom: 8,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
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
    fontSize: 14,
    color: '#555',
    marginLeft: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalForm: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#555',
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#f9f9f9',
    marginBottom: 15,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#28a745',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#dc3545',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  deleteAccContainer: {
    alignItems: 'center',
  },
  deleteAccContent: {
    padding: 20,
    marginTop: 30,
    alignItems: 'center',
    backgroundColor: '#ff7b00',
    width: 200,
    height: 100,
    borderRadius: 10,
    justifyContent: 'center',
  },
  deleteAccText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteAccPrompt: {
    marginTop: 20,
    padding: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  deleteAccPromptText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  deleteAccButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  deleteAccButton1: {
    flex: 1,
    backgroundColor: '#dc3545',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  deleteAccButton2: {
    flex: 1,
    backgroundColor: '#28a745',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  deleteAccButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Profile;