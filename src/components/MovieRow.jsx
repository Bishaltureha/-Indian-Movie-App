import React from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';

const IMAGE_URL = 'https://image.tmdb.org/t/p/w185';

const MovieRow = ({ title, movies = [] }) => {
  const navigation = useNavigation();
  const { darkMode } = useTheme();
  const textColor = darkMode ? '#fff' : '#000';

  const renderItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => navigation.navigate('MovieDetails', { movie: item })}
      style={styles.card}
    >
      <Image
        source={{
          uri: item.poster_path
            ? `${IMAGE_URL}${item.poster_path}`
            : 'https://via.placeholder.com/120x180?text=No+Image',
        }}
        style={styles.image}
      />
    </TouchableOpacity>
  );

  const handleSeeAll = () => {
    navigation.navigate('SeeAllScreen', { title, movies });
  };

  return (
    <View style={styles.rowContainer}>
      <View style={styles.headerRow}>
        <Text style={[styles.rowTitle, { color: textColor }]}>{title}</Text>
        <TouchableOpacity onPress={handleSeeAll} activeOpacity={0.7}>
          <Text style={[styles.seeAllText, { color: textColor }]}>See All</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        horizontal
        data={movies}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  rowContainer: {
    marginBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  rowTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.7,
  },
  card: {
    marginRight: 10,
  },
  image: {
    width: 120,
    height: 180,
    borderRadius: 8,
  },
});

export default MovieRow;
