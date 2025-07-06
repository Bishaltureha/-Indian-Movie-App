import React from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const IMAGE_URL = 'https://image.tmdb.org/t/p/w185';

const SeeAllScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { title, movies = [] } = route.params;

  return (
    <View style={styles.container}>
      {/* Custom Back Button */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={24} color="#fff" />
        <Text style={styles.backText}>{title}</Text>
      </TouchableOpacity>

      <FlatList
        data={movies}
        keyExtractor={item => item.id.toString()}
        numColumns={3}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <TouchableOpacity
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
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#000', // for dark theme
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  backText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 5,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  card: {
    flex: 1 / 3,
    marginHorizontal: 5,
  },
  image: {
    width: '100%',
    aspectRatio: 2 / 3,
    borderRadius: 8,
  },
});

export default SeeAllScreen;
