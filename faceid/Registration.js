import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { confirmSignUp, signUp } from '@aws-amplify/auth';

const RegistrationScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState(''); //new
  const [lastName, setLastName] = useState(''); //new
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerification, setShowVerification] = useState(false);//control verification
  const navigation = useNavigation();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      alert("Passwords don't match. Try again.");
      return;
    }

    try {
      await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
            'custom:FirstName': firstName,
            'custom:LastName': lastName, // kinda useless but could be useful later?
            'custom:photoCount': '0', // initialize to 0
          },
        },
      });
      console.log('Registration successful');
      setShowVerification(true);// verification sent to email
      alert('Registration successful! Check your email for verification code.');
    } catch (error) {
      console.error('Error signing up:', error);
      alert(error.message);
    }
  };

  const handleVerify = async () => {
    if (!verificationCode.trim()) {
      alert('Enter the verification code sent to your email.');
      return;
    }
  
    console.log('Verifying with email:', email);//debugber
  
    try {
      await confirmSignUp({
        username: email,
        confirmationCode: verificationCode,
      });
      alert('Verification successful! You can now login.');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error verifying code:', error);
      alert(error.message);
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registration</Text>
      {!showVerification ? (
        <>
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TextInput
            style={styles.input}
            placeholder="First Name"
            value={firstName}
            onChangeText={setFirstName}
          />
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            value={lastName}
            onChangeText={setLastName}
          />
          <Button title="Register" onPress={handleRegister} />
        </>
      ) : (
        <>
          <TextInput
            style={styles.input}
            placeholder="Verification Code"
            value={verificationCode}
            onChangeText={setVerificationCode}
          />
          <Button title="Verify Email" onPress={handleVerify} />
        </>
      )}
      <View style={styles.gapping} />
      <Button title="Have an account? Sign in here" onPress={() => navigation.navigate('Login')} color="blue" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
  },
  gapping: {
    marginTop: 10,
  }
});

export default RegistrationScreen;
