import React, { useEffect, useState } from 'react';
import { View, Button, StyleSheet, Alert, Text } from 'react-native';
import { signOut, getCurrentUser } from '@aws-amplify/auth';
import * as ImagePicker from 'expo-image-picker';
import { uploadData } from 'aws-amplify/storage';
import { fetchUserAttributes, updateUserAttributes } from '@aws-amplify/auth';
import { TextInput } from 'react-native-web';

// BUG: upload photo uploads but the file type is unopenable even when it's a jpg file
const MainScreen = ({ navigation }) => {
  const [userName, setUserName] = React.useState('');
  const [photoCount, setPhotoCount] = React.useState(0); // Starts counting pics

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userAttributes = await fetchUserAttributes();
        const name = userAttributes['custom:FirstName'];
        console.log('User attributes:', userAttributes);
        if (name) {
          setUserName(name);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleSaveName = async () => {
    try {
      await updateUserAttributes({
        userAttributes: {
          'custom:FirstName': userName,
        },
      });
      Alert.alert('Success', 'Your name has been updated.');
    } catch (error) {
      console.error('Error updating name:', error);
      Alert.alert('Error', 'There was an error updating your name.');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  const takePictureAndUpload = async () => {
    // Request camera permissions
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("You've refused to allow this app to access your camera!");
      return;
    }

    // Launch camera and take picture
    let pickerResult = await ImagePicker.launchImageLibraryAsync();
    if (pickerResult.cancelled) {
      return;
    }

    if (!pickerResult.assets || pickerResult.assets.length === 0) {
      console.log("No photo selected", "You must select a photo to upload.");
      return;
    }

    const selectedImage = pickerResult.assets[0];
    // Uploads to S3 bucket
    try {
      const userAttributes = await fetchUserAttributes();
      let currentPhotoCount = parseInt(userAttributes['custom:photoCount'], 10);
      currentPhotoCount++;

      const response = await fetch(selectedImage.uri);
      const blob = await response.blob();
      const filename = `${userAttributes['custom:FirstName']}-${currentPhotoCount}.jpg`;

      // DEBUG -- finally fixed :''') after 12 hours of debugging - uploads now!
      console.log('Blob size: ', blob.size, 'Blob type: ', blob.type);
      console.log('Picker result: ', pickerResult.uri, 'Filename: ', filename);
      console.log('picker result2: ', pickerResult);

      await uploadData({
        key: filename,
        data: blob,
        options: {
          contentType: 'image/jpeg',
          level: 'public',
        },
      });

      await updateUserAttributes({
        userAttributes: {
          'custom:photoCount': currentPhotoCount.toString(),
        },
      });

      Alert.alert("Upload Successful", `Your photo has been uploaded.`);
    } catch (error) {
      console.log('Error uploading photo: ', error);
      Alert.alert("Upload Error", "There was an error uploading your photo.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Welcome, {userName || 'Guest'}! Welcome to your FaceID Door Unlock System!</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        value={userName}
        onChangeText={setUserName} // just sets the first name
      />
      <Button title="Change Name" onPress={handleSaveName} />
      <View style={styles.gapping} />
      <Button title="Take Picture and Upload" onPress={takePictureAndUpload} />
      <View style={styles.gapping} />
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: '100%',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    margin: 10,
  },
  gapping: {
    marginBottom: 10,
  }
});

export default MainScreen;
