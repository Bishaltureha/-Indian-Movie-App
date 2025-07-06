import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaView, StatusBar } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';

import HomeScreen from './src/screens/HomeScreen';
import MovieDetailsScreen from './src/screens/MovieDetailsScreen';
import FavoritesScreen from './src/screens/FavoritesScreen';
import ActorDetailsScreen from './src/screens/ActorDetailsScreen';
import SeeAllScreen from './src/screens/SeeAllScreen';

const Stack = createNativeStackNavigator();

const AppStack = () => {
  const { darkMode } = useTheme();

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: darkMode ? '#000' : '#fff' }}
    >
      <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="MovieDetails" component={MovieDetailsScreen} />
        <Stack.Screen name="Favorites" component={FavoritesScreen} />
        <Stack.Screen name="ActorDetails" component={ActorDetailsScreen} />
        <Stack.Screen name="SeeAllScreen" component={SeeAllScreen} />
      </Stack.Navigator>
    </SafeAreaView>
  );
};

const App = () => (
  <ThemeProvider>
    <NavigationContainer>
      <AppStack />
    </NavigationContainer>
  </ThemeProvider>
);

export default App;
