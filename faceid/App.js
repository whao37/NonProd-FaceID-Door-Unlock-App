import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import RegistrationScreen from './Registration';
import LoginScreen from './Login';
import MainScreen from './MainScreen';
import { StatusBar } from 'expo-status-bar';
import { Amplify } from 'aws-amplify';
//import awsmobile from './src/aws-exports';
import amplifyconfig from './src/amplifyconfiguration.json';
import AsyncStorage from '@react-native-async-storage/async-storage';

//awsmobile.ssr = true;

//Amplify.configure(awsmobile);
Amplify.configure(amplifyconfig);

// Amplify.configure({
//   ...awsmobile,
//   Auth: {
//     ...awsmobile.Auth,
//     storage: AsyncStorage,
//   }
// });

const Stack = createStackNavigator();
//use this to add more things like login screen, main screen, basically web pages like with html
function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Registration" component={RegistrationScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Main" component={MainScreen} />
        {}
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

export default App;
