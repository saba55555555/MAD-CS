// screens/LoginScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Navigation import ki
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation(); // Navigation hook initialize kiya

  // Register Function
  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert('Success', 'Welcome to Paradise Resort! 🎉');
      // Account banne ke baad seedha Home par bhejne ke liye:
      navigation.replace('Home'); 
    } catch (error) {
      Alert.alert('Registration Error', error.message);
    }
    setLoading(false);
  };

  // Login Function
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Login successful! Ab Home screen par redirect karein
      navigation.replace('Home'); 
    } catch (error) {
      // User ko asaan lafzon mein error batane ke liye
      let errorMessage = "Login failed. Please check your credentials.";
      if (error.code === 'auth/user-not-found') errorMessage = "User nahi mila!";
      if (error.code === 'auth/wrong-password') errorMessage = "Ghalat password!";
      
      Alert.alert('Login Error', errorMessage);
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          {/* Resort Header */}
          <View style={styles.header}>
            <Text style={styles.resortIcon}>🏝️</Text>
            <Text style={styles.title}>Paradise Resort</Text>
            <Text style={styles.subtitle}>Your Tropical Getaway</Text>
          </View>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputIcon}>📧</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputIcon}>🔒</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          {/* Login Button */}
          <TouchableOpacity 
            style={[styles.button, styles.loginButton]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.buttonIcon}>🔑</Text>
            <Text style={styles.buttonText}>
              {loading ? 'Signing In...' : 'Login'}
            </Text>
            {loading && <ActivityIndicator color="white" style={styles.buttonSpinner} />}
          </TouchableOpacity>

          {/* Register Button */}
          <TouchableOpacity 
            style={[styles.button, styles.registerButton]}
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={styles.buttonIcon}>📋</Text>
            <Text style={styles.buttonText}>
              {loading ? 'Creating...' : 'Create Account'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8f4f8',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
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
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  resortIcon: {
    fontSize: 50,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E8B57',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  inputIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  input: {
    flex: 1,
    padding: 15,
    fontSize: 16,
    color: '#333',
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
  loginButton: {
    backgroundColor: '#2E8B57',
  },
  registerButton: {
    backgroundColor: '#FF6B35',
  },
});

export default LoginScreen;