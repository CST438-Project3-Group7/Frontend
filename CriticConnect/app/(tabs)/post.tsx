import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Picker,
  Modal,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from "expo-router";

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

/*
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
}; */

const PostForm: React.FC = () => {
  const [post, setPost] = useState<Omit<Post, "postId">>({
    title: "",
    content: "",
    likes: 0,
    dislikes: 0,
    user: {
      userId: 1, 
      username: "trent",
      password: "test",
      roles: "ADMIN",
    },
    subject: { title: "", year: new Date().getFullYear(), type: "", favorites: [] },
    comments: [],
    datetime: new Date().toISOString(),
  });

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [newSubject, setNewSubject] = useState<Subject>({
    title: "",
    year: new Date().getFullYear(),
    type: "",
    favorites: [],
  });
  const [showModal, setShowModal] = useState(false);

  // Fetch all subjects
  const fetchSubjects = async () => {
    try {
      const response = await fetch(
        //"http://localhost:8080/api/subjects",
        "https://criticconnect-386d21b2b7d1.herokuapp.com/api/subjects",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      Alert.alert("data", data);
      setSubjects(data);
      console.log(data);
      console.log(subjects);
    } catch (error) {
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
      Alert.alert("Error", "Failed to create subject.");
    }
  };

  // Submit post
  const handleSubmit = async () => {
    try {
      const now = Date.now();
      const date = new Date(now);
      const isoDate = date.toISOString().split(".")[0];

      const postToSubmit = { ...post, datetime: isoDate, likes: 0, dislikes: 0 }; 
      console.log(postToSubmit);
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
        router.push('/feed');
      } else {
        Alert.alert("Error", "Failed to create post.");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to create post.");
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  return (
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
        <Text>Subject:</Text>
        <Picker
          selectedValue={post.subject.subjectId}
          onValueChange={(value) => {
            if (value === "new") {
              setShowModal(true);
            } else {
              console.log("subjects", subjects);
              const selectedSubject = subjects.find((s) => s.subjectId == value);
              console.dir(value);
              console.log("selectedSubject", selectedSubject);
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
              <Text>Create New Subject</Text>
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
              <TextInput
                style={styles.input}
                placeholder="Type"
                value={newSubject.type}
                onChangeText={(text) => setNewSubject({ ...newSubject, type: text })}
              />
              <Button title="Create Subject" onPress={handleNewSubjectSubmit} />
              <Button title="Cancel" onPress={() => setShowModal(false)} />
            </View>
          </View>
        </Modal>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  formGroup: { marginBottom: 20 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 5 },
  textarea: { borderWidth: 1, borderColor: "#ccc", padding: 10, height: 100, textAlignVertical: "top" },
  modalContainer: { flex: 1, justifyContent: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContent: { backgroundColor: "white", padding: 20, margin: 20, borderRadius: 10 },
});

export default PostForm;
