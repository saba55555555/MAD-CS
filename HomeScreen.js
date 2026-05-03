// screens/HomeScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { signOut } from 'firebase/auth';
import { collection, addDoc, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { auth, db } from '../firebase';

const HomeScreen = () => {
  const [resortNote, setResortNote] = useState('');
  const [savedNote, setSavedNote] = useState('');
  const [loading, setLoading] = useState(false);
  const user = auth.currentUser;

  // Load saved note when component mounts
  useEffect(() => {
    if (user) {
      loadUserNote(user.uid);
    }
  }, [user]);

  // Save Note to Firebase
  const saveNoteToFirebase = async () => {
    if (!resortNote.trim()) {
      Alert.alert('Error', 'Please enter your resort experience');
      return;
    }

    setLoading(true);
    try {
      // Store data under user's UID
      await addDoc(collection(db, 'resortNotes'), {
        text: resortNote,
        userId: user.uid,
        userEmail: user.email,
        createdAt: new Date()
      });
      
      setSavedNote(resortNote);
      setResortNote('');
      Alert.alert('Success', 'Resort memory saved! 🌟');
      
      // Reload to show saved data
      loadUserNote(user.uid);
    } catch (error) {
      Alert.alert('Save Error', error.message);
    }
    setLoading(false);
  };

  // Load Saved Note
  const loadUserNote = async (userId) => {
    try {
      const q = query(
        collection(db, 'resortNotes'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(1)
      );
      
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const latestNote = querySnapshot.docs[0].data();
        setSavedNote(latestNote.text);
      }
    } catch (error) {
      console.log('Error loading note:', error);
    }
  };

  // Logout Function
  const handleLogout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
    } catch (error) {
      Alert.alert('Logout Error', error.message);
    }
    setLoading(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeIcon}>🌴</Text>
          <Text style={styles.welcomeTitle}>Welcome to Paradise!</Text>
          <Text style={styles.userEmail}>Guest: {user?.email}</Text>
        </View>

        {/* Note Input Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📝 Share Your Resort Experience</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Write about your stay, favorite moments, or suggestions..."
            placeholderTextColor="#999"
            value={resortNote}
            onChangeText={setResortNote}
            multiline
            numberOfLines={4}
          />
          
          {/* Save to Firebase Button */}
          <TouchableOpacity 
            style={[styles.button, styles.saveButton]}
            onPress={saveNoteToFirebase}
            disabled={loading}
          >
            <Text style={styles.buttonIcon}>💾</Text>
            <Text style={styles.buttonText}>
              {loading ? 'Saving...' : 'Save to Firebase'}
            </Text>
            {loading && <ActivityIndicator color="white" style={styles.buttonSpinner} />}
          </TouchableOpacity>
        </View>

        {/* Saved Note Display */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🌟 Your Saved Memory</Text>
          {savedNote ? (
            <View style={styles.noteContainer}>
              <View style={styles.noteBox}>
                <Text style={styles.savedNoteText}>{savedNote}</Text>
              </View>
              <Text style={styles.noteInfo}>Stored securely in Firestore under your UID</Text>
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📄</Text>
              <Text style={styles.emptyText}>No memories saved yet</Text>
              <Text style={styles.emptySubtext}>Your notes will appear here after saving</Text>
            </View>
          )}
        </View>

        {/* Logout Button */}
        <TouchableOpacity 
          style={[styles.button, styles.logoutButton]}
          onPress={handleLogout}
          disabled={loading}
        >
          <Text style={styles.buttonIcon}>🚪</Text>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#e8f4f8',
    padding: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#f0f0f0',
  },
  welcomeIcon: {
    fontSize: 50,
    marginBottom: 10,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E8B57',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
    height: 120,
    textAlignVertical: 'top',
    marginBottom: 15,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  buttonIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonSpinner: {
    marginLeft: 8,
  },
  saveButton: {
    backgroundColor: '#FFA500',
  },
  logoutButton: {
    backgroundColor: '#DC143C',
  },
  noteContainer: {
    backgroundColor: '#e8f5e8',
    borderRadius: 12,
    padding: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#2E8B57',
  },
  noteBox: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  savedNoteText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  noteInfo: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  emptyState: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderStyle: 'dashed',
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 10,
    opacity: 0.5,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 5,
  },
});

export default HomeScreen;