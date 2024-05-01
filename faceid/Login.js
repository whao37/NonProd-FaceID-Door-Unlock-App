import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { signIn, getCurrentUser } from '@aws-amplify/auth';
import { useNavigation } from '@react-navigation/native';
import { ConsoleLogger } from 'aws-amplify/utils';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    checkCurrentUser();
  }, []);

  const checkCurrentUser = async () => {
    try {
      console.log('getCurrentUser call initated');
      await getCurrentUser();//check who is logged in
      console.log('User is already logged in (authenticated) going to main screen');
      navigation.navigate('Main');
    } catch (error) {
      console.log('No current user', error);
    }
  };

  const handleLogin = async () => {
    try {
      await signIn({ username: email, password });
      console.log('Login successful');
      navigation.navigate('Main');
    } catch (error) {
      console.error('Login error:', error);
      alert(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <View style={styles.gapping} />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
  },
  gapping: {
    marginBottom: 12,
  }
});

export default LoginScreen;
