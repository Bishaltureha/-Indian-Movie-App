import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../context/ThemeContext';

const API_KEY = 'c856834ab20ef843559b338e1eb3db43';

export default function FavoritesScreen() {
  const { darkMode } = useTheme();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const favIds = JSON.parse(await AsyncStorage.getItem('favorites')) || [];
      const movies = [];

      for (let id of favIds) {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`,
        );
        const movie = await res.json();
        if (movie && movie.id) {
          movies.push(movie);
        }
      }

      setFavorites(movies); // All valid
    } catch (error) {
      console.error('Failed to load favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromFavorites = async id => {
    const updated = favorites.filter(m => m.id !== id);
    setFavorites(updated);
    await AsyncStorage.setItem(
      'favorites',
      JSON.stringify(updated.map(m => m.id)),
    );
  };

  if (loading) {
    return (
      <View
        style={[styles.loader, { backgroundColor: darkMode ? '#000' : '#fff' }]}
      >
        <ActivityIndicator size="large" color="#e50914" />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: darkMode ? '#000' : '#fff' },
      ]}
    >
      {/* Header */}
      <View
        style={[
          styles.headerContainer,
          { backgroundColor: darkMode ? '#111' : '#eee' },
        ]}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons
            name="arrow-back"
            size={24}
            color={darkMode ? '#fff' : '#000'}
          />
        </TouchableOpacity>
        <Text
          style={[styles.headerText, { color: darkMode ? '#fff' : '#000' }]}
        >
          Your Favorites
        </Text>
      </View>

      {favorites.length === 0 ? (
        <Text style={[styles.noFavText, { color: darkMode ? '#fff' : '#000' }]}>
          No favorites yet
        </Text>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item, index) =>
            item?.id?.toString?.() || index.toString()
          }
          contentContainerStyle={{ padding: 10 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.movieCard,
                { backgroundColor: darkMode ? '#111' : '#f0f0f0' },
              ]}
              onPress={() =>
                navigation.navigate('MovieDetails', { movie: item })
              }
            >
              <Image
                source={{
                  uri: item.poster_path
                    ? `https://image.tmdb.org/t/p/w185${item.poster_path}`
                    : 'https://via.placeholder.com/100x150?text=No+Image',
                }}
                style={styles.poster}
              />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text
                  style={[styles.title, { color: darkMode ? '#fff' : '#000' }]}
                >
                  {item.title || item.name}
                </Text>
                <TouchableOpacity
                  onPress={() => removeFromFavorites(item.id)}
                  style={styles.removeBtn}
                >
                  <Ionicons name="trash" size={16} color="#fff" />
                  <Text style={styles.removeText}>Remove</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  headerText: {
    fontSize: 20,
    marginLeft: 10,
    fontWeight: 'bold',
  },
  noFavText: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 18,
  },
  movieCard: {
    flexDirection: 'row',
    marginBottom: 15,
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  poster: {
    width: 80,
    height: 120,
    borderRadius: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  removeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e50914',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  removeText: {
    color: '#fff',
    marginLeft: 6,
    fontWeight: 'bold',
  },
});
