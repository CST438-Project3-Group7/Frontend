import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Modal,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  Platform,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useFocusEffect } from "expo-router";
import Rating from "@/components/Rating";
import WebNavBar from './WebNavBar';
import PhoneNavBar from './PhoneNavBar';

interface User {
  userId: number;
  username: string;
  password: string;
  roles: string;
}

interface Subject {
  subjectId?: number;
  title: string;
  year: number;
  type: string;
  favorites: any[];
}

interface Post {
  postId: number;
  title: string;
  content: string;
  likes: number | null;
  dislikes: number | null;
  user: User;
  subject: Subject;
  comments: any[];
  datetime: string;
}

const PostForm: React.FC = () => {
  const [post, setPost] = useState<Omit<Post, "postId">>({
    title: "",
    content: "",
    likes: 0,
    dislikes: 0,
    user: {
      userId: 0,
      username: "",
      password: "",
      roles: "",
    },
    subject: { title: "", year: new Date().getFullYear(), type: "", favorites: [] },
    comments: [],
    datetime: new Date().toISOString(),
  });
  const [user, setUser] = useState<User | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [newSubject, setNewSubject] = useState<Subject>({
    title: "",
    year: new Date().getFullYear(),
    type: "",
    favorites: [],
  });
  const [showModal, setShowModal] = useState(false);

  // Fetch user data from AsyncStorage and the database
  const fetchUserData = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        console.error("No user ID found in AsyncStorage");
        Alert.alert("Error", "User not found.");
        setUser(null);
        return;
      }

      const response = await fetch(`https://criticconnect-386d21b2b7d1.herokuapp.com/api/users/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching user data: ${response.status}`);
      }

      const userData = await response.json();
      setPost((prevPost) => ({
        ...prevPost,
        user: userData,
      }));
      setUser(userData);
    } catch (error) {
      console.error("Error retrieving user data:", error);
      Alert.alert("Error", "Failed to fetch user data.");
    }
  };

  // Fetch all subjects
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
      setSubjects(data);
    } catch (error) {
      console.error("Error fetching subjects:", error);
      Alert.alert("Error", "Failed to fetch subjects.");
    }
  };

  // Create a new subject
  const handleNewSubjectSubmit = async () => {
    try {
      const response = await fetch(
        "https://criticconnect-386d21b2b7d1.herokuapp.com/api/subjects",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newSubject),
        }
      );

      if (response.ok) {
        const createdSubject = await response.json();
        setSubjects([...subjects, createdSubject]);
        setPost({ ...post, subject: createdSubject });
        setShowModal(false);
        setNewSubject({ title: "", year: new Date().getFullYear(), type: "", favorites: [] });
      } else {
        Alert.alert("Error", "Failed to create subject.");
      }
    } catch (error) {
      console.error("Error creating subject:", error);
      Alert.alert("Error", "Failed to create subject.");
    }
  };

  const [rating, setRating] = useState(0);

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);

    setPost((prevPost) => ({
      ...prevPost,
      dislikes: newRating, 
    }));
  };

  // Submit post
  const handleSubmit = async () => {
    try {
      const now = Date.now();
      const date = new Date(now);
      const isoDate = date.toISOString().split(".")[0];

      console.log("dislikes + : " + rating);
      
      const postToSubmit = { ...post, datetime: isoDate, likes: 0};
      console.log("Post to submit:", postToSubmit);

      console.log("Post to submit:", post);


      const response = await fetch(
        "https://criticconnect-386d21b2b7d1.herokuapp.com/api/posts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postToSubmit),
        }
      );

      if (response.ok) {
        Alert.alert("Success", "Post created successfully!");
        setPost({
          title: "",
          content: "",
          likes: 0,
          dislikes: 0,
          user: {
            userId: 0,
            username: "",
            password: "",
            roles: "",
          },
          subject: { title: "", year: new Date().getFullYear(), type: "", favorites: [] },
          comments: [],
          datetime: new Date().toISOString(),
        });
        router.push('/feed');
      } else {
        Alert.alert("Error", "Failed to create post.");
      }
    } catch (error) {
      console.error("Error submitting post:", error);
      Alert.alert("Error", "Failed to create post.");
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchSubjects();
      fetchUserData(); // Fetch user data on component mount
    }, [])
  );

  return (
    <View>
      {Platform.OS === 'web' ? (
      <WebNavBar username={user?.username} />
      ) : (
      <PhoneNavBar username={user?.username} />
      )}
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Create Post</Text>
      <View style={styles.formGroup}>
        <Text>Title:</Text>
        <TextInput
          style={styles.input}
          value={post.title}
          onChangeText={(text) => setPost({ ...post, title: text })}
        />
      </View>
      <View style={styles.formGroup}>
        <Text>Content:</Text>
        <TextInput
          style={styles.textarea}
          value={post.content}
          multiline
          onChangeText={(text) => setPost({ ...post, content: text })}
        />
      </View>

      <View style={styles.formGroup}>
        <Text>Rating:</Text>
        <Rating rating={rating} onChange={handleRatingChange} />
      </View>


      <View style={styles.formGroup}>
        <Text>Subject:</Text>
        <Picker
          selectedValue={post.subject.subjectId}
          onValueChange={(value) => {
            if (value === "new") {
              setShowModal(true);
            } else {
              const selectedSubject = subjects.find((s) => s.subjectId == value);
              if (selectedSubject) setPost({ ...post, subject: selectedSubject });
            }
          }}
        >
          <Picker.Item label="Select a subject" value="" />
          {subjects.map((subject) => (
            <Picker.Item
              key={subject.subjectId}
              label={`${subject.title} (${subject.year})`}
              value={subject.subjectId}
            />
          ))}
          <Picker.Item label="Create new subject" value="new" />
        </Picker>
      </View>
      <Button title="Submit Post" onPress={handleSubmit} />

      {/* Modal for creating a new subject */}
      {showModal && (
        <Modal visible={showModal} animationType="slide" transparent>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalHeader}>Create New Subject</Text>
              <TextInput
                style={styles.input}
                placeholder="Title"
                value={newSubject.title}
                onChangeText={(text) => setNewSubject({ ...newSubject, title: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Year"
                keyboardType="numeric"
                value={String(newSubject.year)}
                onChangeText={(text) => setNewSubject({ ...newSubject, year: Number(text) })}
              />
              <Text style={styles.radioHeader}>Type:</Text>
              {["Film", "Book", "Video_Game"].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={styles.radioContainer}
                  onPress={() => setNewSubject({ ...newSubject, type })}
                >
                  <View
                    style={[
                      styles.radioCircle,
                      newSubject.type === type && styles.radioCircleSelected,
                    ]}
                  />
                  <Text style={styles.radioLabel}>{type.replace("_", " ")}</Text>
                </TouchableOpacity>
              ))}
              <Button title="Create Subject" onPress={handleNewSubjectSubmit} />
              <Button title="Cancel" onPress={() => setShowModal(false)} />
            </View>
          </View>
        </Modal>
      )}
    </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f9f9f9",
    flex: 1,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#343a40",
    marginBottom: 20,
    textAlign: "center",
  },
  formGroup: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  textarea: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    height: 120,
    borderRadius: 8,
    backgroundColor: "#fff",
    fontSize: 16,
    textAlignVertical: "top",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 12,
    width: "85%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  modalHeader: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#343a40",
    marginBottom: 16,
    textAlign: "center",
  },
  radioHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
    color: "#343a40",
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#ddd",
    marginRight: 12,
  },
  radioCircleSelected: {
    borderColor: "#007BFF",
    backgroundColor: "#007BFF",
  },
  radioLabel: {
    fontSize: 16,
    color: "#495057",
  },
  picker: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 8,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#dc3545",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default PostForm;