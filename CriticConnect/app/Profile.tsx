import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Modal, Picker } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import WebNavBar from './WebNavBar';
import moment from 'moment';
import { router,useFocusEffect } from 'expo-router';
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
      router.push('/login');
    } catch (error) {
      console.error('Error deleting account:', error);
      alert(`An error occurred while deleting the account: ${error.message}`);
    }
  }

  return (
    <View style={styles.container}>
      <WebNavBar username={user?.username || "Guest"} />
      <ScrollView style={styles.content}>
          <Text style={styles.title}>{user?.username || "Guest"}'s Profile</Text>
          {/* <TouchableOpacity style={styles.profileActions} onPress={() => router.push('/feed')}>
            <Text>Back to Feed</Text>
          </TouchableOpacity> */}
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
                    {post.subject} • Posted by u/{post.author} {post.timeAgo}
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
                    <TouchableOpacity style={styles.actionButton}>
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
                <TouchableOpacity style={styles.deleteAccButton} onPress={() => router.push('/feed')}>
                  <Text style={styles.deleteAccButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteAccButton} onPress={() => handleDeleteAcc(user)}>
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
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  User: {
    width: '100%',
    shadowColor: 'blue',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 10,
    shadowRadius: 20,
    elevation: 3,
    padding: 15,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', 
    marginTop: 15,
    marginBottom: 15,
  },
  sortWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortDropDown: {
    height: 40,
    width: 150,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  horizontalLine: {
    height: 1,
    backgroundColor: 'black',
    width: '100%',
    marginVertical: 20,
  },
  postsContainer: {
    width: '100%',
  },
  post: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderColor: 'black',
    borderWidth: 2,
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
  deleteForm: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  input: {
    height: 40,
    width: '45%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  buttonSpacing: {
    marginRight: 10, // Add space between the buttons
  },
  saveButton: {
    flex: 1,
    backgroundColor: 'green',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
    width: 150,
    height: 50,
    marginLeft: 10,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: 'red',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
    width: 150,
    height: 50,
    marginRight: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  profileActions: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
    borderColor: 'black',
    borderWidth: 2,
    width: 150,
    height: 50,
    marginBottom: 5,
  },
  editProfileButtonText: {
    fontSize: 16,
    color: '#333',
  },
  editProfileIcon: {
    flex: 0,
    marginLeft: 10,
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
  deleteAccButton: {
    flex: 1,
    backgroundColor: 'red',
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
  sortText: {
    fontSize: 16,
    marginRight: 8,
  },
  
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '40%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'left',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
  modalForm: {
    alignItems: 'center',
  },
});

export default Profile;