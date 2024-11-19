import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Picker } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import WebNavBar from './WebNavBar';
import moment from 'moment';

const initialPosts = [
  { id: 1, title: "Check out this cute cat!", author: "catlover123", subreddit: "r/aww", upvotes: 15200, comments: 304, timestamp: new Date('2024-05-20T10:00:00') },
  { id: 2, title: "TIL the world's oldest known living tree is over 5,000 years old", author: "natureenthusiast", subreddit: "r/todayilearned", upvotes: 24700, comments: 1023, timestamp: new Date('2024-07-20T03:00:00') },
  { id: 3, title: "What's a book that changed your life?", author: "bookworm42", subreddit: "r/AskReddit", upvotes: 9800, comments: 3205, timestamp: new Date('2024-11-18T12:00:00') },
];


const Feed = () => {
  const [posts, setPosts] = useState(initialPosts);
  const [selectedSort, setSelectedSort] = useState('newest');

  useEffect(() => {
    const postsWithTimeAgo = posts.map(post => ({
      ...post,
      timeAgo: moment(post.timestamp).fromNow()
    }));
    setPosts(postsWithTimeAgo);
  }, []);

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
      case 'subreddit':
        sortedPosts.sort((a, b) => a.subreddit.localeCompare(b.subreddit));
        break;
      default:
        break;
    }
    setPosts(sortedPosts);
    setSelectedSort(sortOption);
  };

  return (
    <View style={styles.container}>
      <WebNavBar />
      <ScrollView style={styles.content}>
        <View style={styles.sortContainer}>
          <Picker
            selectedValue={selectedSort}
            style={{ height: 50, width: 150 }}
            onValueChange={(itemValue) => sortPosts(itemValue)}
          >
            <Picker.Item label="Newest" value="newest" />
            <Picker.Item label="Oldest" value="oldest" />
            <Picker.Item label="Most Liked" value="most-liked" />
            <Picker.Item label="Subreddit" value="subreddit" />
          </Picker>
        </View>
        <View style={styles.postsContainer}>
          {posts.map(post => (
            <View key={post.id} style={styles.post}>
              <View style={styles.postContent}>
                <View style={styles.postDetails}>
                  <Text style={styles.postMeta}>
                    {post.subreddit} • Posted by u/{post.author} {post.timeAgo}
                  </Text>
                  <Text style={styles.postTitle}>{post.title}</Text>
                  <View style={styles.postActions}>
                    <TouchableOpacity style={styles.actionButton}>
                      <Ionicons name="thumbs-up-outline" size={16} color="gray" />
                      <Text style={styles.actionText}>Like amount</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                      <Ionicons name="thumbs-down-outline" size={16} color="gray" />
                      <Text style={styles.actionText}>Dislike amount</Text>
                    </TouchableOpacity>
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
          ))}
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
});

export default Feed;