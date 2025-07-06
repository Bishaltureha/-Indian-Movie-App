import React, { useEffect, useState, useCallback } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../context/ThemeContext';

import { fetchMovies, endpoints } from '../utils/api';
import MovieRow from '../components/MovieRow';
import Banner from '../components/Banner';
import SearchBar from '../components/SearchBar';

const HomeScreen = ({ navigation }) => {
  const { darkMode, toggleTheme } = useTheme();
  const backgroundColor = darkMode ? '#000' : '#fff';
  const textColor = darkMode ? '#fff' : '#000';

  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAll = async () => {
      const arr = await Promise.all(
        Object.values(endpoints).map(ep => fetchMovies(ep)),
      );
      setData({
        trending: arr[0],
        topRated: arr[1],
        newMovies: arr[2],
        newSeries: arr[3],
        trendingSeries: arr[4],
      });
      setLoading(false);
    };
    loadAll();
  }, []);

  const handleSeeAll = useCallback(
    (title, movies) => {
      navigation.navigate('SeeAllScreen', { title, movies });
    },
    [navigation],
  );

  if (loading) {
    return (
      <View style={[styles.loader, { backgroundColor }]}>
        <ActivityIndicator size="large" color={textColor} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor }}>
      {/* Theme Toggle Button */}
      <TouchableOpacity
        onPress={toggleTheme}
        style={{ alignSelf: 'flex-end', margin: 10 }}
      >
        <Ionicons name="contrast" size={24} color={textColor} />
      </TouchableOpacity>

      <ScrollView style={[styles.container, { backgroundColor }]}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <Text style={[styles.header, { color: textColor }]}>
            🎬 Indian Movie App
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Favorites')}>
            <Ionicons name="heart" size={24} color="#e50914" />
          </TouchableOpacity>
        </View>

        {/* Search */}
        <SearchBar />

        {/* Banner */}
        <Banner movie={data.trending[0]} navigation={navigation} />

        {/* Movie Rows with See All */}
        {Object.entries(data).map(([key, movies]) => (
          <MovieRow
            key={key}
            title={titleMap[key]}
            movies={movies}
            onSeeAll={handleSeeAll}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const titleMap = {
  trending: 'Trending Movies',
  topRated: 'Top Rated Movies',
  newMovies: 'Now Playing',
  newSeries: 'New TV Shows',
  trendingSeries: 'Trending TV Shows',
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default HomeScreen;
