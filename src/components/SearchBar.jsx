import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';

const API_KEY = 'c856834ab20ef843559b338e1eb3db43';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const navigation = useNavigation();
  const { darkMode } = useTheme();

  useEffect(() => {
    loadSearchHistory();
  }, []);

  const loadSearchHistory = async () => {
    const history = await AsyncStorage.getItem('search_history');
    if (history) setSearchHistory(JSON.parse(history));
  };

  const updateHistory = async newTerm => {
    const term = newTerm.trim().toLowerCase();
    const updated = [
      newTerm,
      ...searchHistory.filter(q => q.toLowerCase() !== term),
    ].slice(0, 10);
    setSearchHistory(updated);
    await AsyncStorage.setItem('search_history', JSON.stringify(updated));
  };

  const clearHistory = async () => {
    setSearchHistory([]);
    await AsyncStorage.removeItem('search_history');
  };

  const searchMovies = async text => {
    setQuery(text);
    if (text.length < 2) return setResults([]);

    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${text}&with_origin_country=IN`,
      );
      const data = await res.json();
      setResults(data.results || []);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const handleSelect = movie => {
    updateHistory(movie.title);
    setResults([]);
    setQuery('');
    navigation.navigate('MovieDetails', { movie });
  };

  const searchAndNavigate = async term => {
    setQuery(term);
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${term}&with_origin_country=IN`,
      );
      const data = await res.json();
      const found = data.results?.[0];
      if (found) handleSelect(found);
      else alert('No Indian movie found');
    } catch (err) {
      console.error(err);
    }
  };

  const handleIconPress = () => {
    if (results.length > 0) {
      handleSelect(results[0]);
    } else {
      alert('No Indian movie found');
    }
  };

  return (
    <View style={styles.container}>
      {/* Input */}
      <View
        style={[
          styles.inputWrapper,
          { backgroundColor: darkMode ? '#222' : '#eee' },
        ]}
      >
        <TextInput
          value={query}
          onChangeText={searchMovies}
          placeholder="Search Indian movies..."
          placeholderTextColor={darkMode ? '#aaa' : '#666'}
          style={[styles.input, { color: darkMode ? '#fff' : '#000' }]}
        />
        <TouchableOpacity onPress={handleIconPress} style={styles.icon}>
          <Ionicons
            name="search"
            size={20}
            color={darkMode ? '#fff' : '#000'}
          />
        </TouchableOpacity>
      </View>

      {/* Dropdown results */}
      {query && results.length > 0 && (
        <FlatList
          data={results.slice(0, 5)}
          keyExtractor={item => item.id.toString()}
          style={[
            styles.dropdown,
            { backgroundColor: darkMode ? '#111' : '#ddd' },
          ]}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleSelect(item)}>
              <Text
                style={[styles.result, { color: darkMode ? '#fff' : '#000' }]}
              >
                {item.title}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}

      {/* History (when no query) */}
      {!query && searchHistory.length > 0 && (
        <View
          style={[
            styles.historyContainer,
            { backgroundColor: darkMode ? '#111' : '#f3f3f3' },
          ]}
        >
          <View style={styles.historyHeader}>
            <Text
              style={{ color: darkMode ? '#fff' : '#000', fontWeight: 'bold' }}
            >
              Recent Searches
            </Text>
            <TouchableOpacity onPress={clearHistory}>
              <Ionicons name="close-circle" size={20} color="#e50914" />
            </TouchableOpacity>
          </View>

          {searchHistory.map((term, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => searchAndNavigate(term)}
              style={styles.historyItem}
            >
              <Ionicons
                name="time"
                size={16}
                color={darkMode ? '#999' : '#333'}
                style={{ marginRight: 6 }}
              />
              <Text style={{ color: darkMode ? '#fff' : '#000' }}>{term}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 15 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
  },
  icon: { padding: 6 },
  dropdown: {
    marginTop: 4,
    borderRadius: 8,
    maxHeight: 200,
  },
  result: {
    padding: 10,
    borderBottomColor: '#333',
    borderBottomWidth: 1,
  },
  historyContainer: {
    marginTop: 10,
    borderRadius: 8,
    padding: 10,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
});

export default SearchBar;
