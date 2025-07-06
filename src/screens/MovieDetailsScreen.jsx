import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import YoutubePlayer from 'react-native-youtube-iframe';
import { useTheme } from '../context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';

const API_KEY = 'c856834ab20ef843559b338e1eb3db43';

export default function MovieDetailsScreen({ route }) {
  const { movie } = route.params;
  const [cast, setCast] = useState([]);
  const [trailerKey, setTrailerKey] = useState(null);
  const [isFav, setIsFav] = useState(false);
  const { darkMode } = useTheme();
  const navigation = useNavigation();

  useEffect(() => {
    fetchDetails();
    checkFav();
  }, []);

  const fetchDetails = async () => {
    try {
      const [castRes, videoRes] = await Promise.all([
        fetch(
          `https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=${API_KEY}`,
        ),
        fetch(
          `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${API_KEY}`,
        ),
      ]);

      const castData = await castRes.json();
      const videoData = await videoRes.json();

      setCast((castData.cast || []).slice(0, 10));

      const trailer = (videoData.results || []).find(
        v => v.site === 'YouTube' && v.type === 'Trailer',
      );
      setTrailerKey(trailer?.key);
    } catch (err) {
      console.error('Failed to fetch movie details:', err);
    }
  };

  const checkFav = async () => {
    const list = JSON.parse((await AsyncStorage.getItem('favorites')) || '[]');
    setIsFav(list.includes(movie.id));
  };

  const toggleFav = async () => {
    const list = JSON.parse((await AsyncStorage.getItem('favorites')) || '[]');
    const updated = isFav
      ? list.filter(id => id !== movie.id)
      : [...list, movie.id];
    await AsyncStorage.setItem('favorites', JSON.stringify(updated));
    setIsFav(!isFav);
  };

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: darkMode ? '#000' : '#fff' },
      ]}
    >
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color={'#fff'} />
      </TouchableOpacity>

      <Image
        source={{
          uri: movie.backdrop_path
            ? `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`
            : `https://image.tmdb.org/t/p/w300${movie.poster_path}`,
        }}
        style={styles.image}
      />

      <View style={styles.content}>
        <View style={styles.rowTop}>
          <Text style={[styles.title, { color: darkMode ? '#fff' : '#000' }]}>
            {movie.title || movie.name}
          </Text>
          <TouchableOpacity onPress={toggleFav}>
            <Ionicons
              name={isFav ? 'heart' : 'heart-outline'}
              size={26}
              color="#e50914"
            />
          </TouchableOpacity>
        </View>

        <Text style={[styles.meta, { color: darkMode ? '#ccc' : '#444' }]}>
          Release Date: {movie.release_date}
        </Text>
        <Text style={[styles.meta, { color: darkMode ? '#ccc' : '#444' }]}>
          Rating: {movie.vote_average}
        </Text>
        <Text style={[styles.overview, { color: darkMode ? '#ddd' : '#333' }]}>
          {movie.overview}
        </Text>

        {trailerKey && (
          <View style={{ marginTop: 15 }}>
            <YoutubePlayer
              height={200}
              videoId={trailerKey}
              play={false}
              webViewStyle={{ opacity: 0.99 }}
            />
          </View>
        )}

        <Text style={[styles.castTitle, { color: darkMode ? '#fff' : '#000' }]}>
          Top Cast
        </Text>

        <FlatList
          data={cast}
          horizontal
          keyExtractor={item => item.id.toString()}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.actorCard}
              onPress={() =>
                navigation.navigate('ActorDetails', { actorId: item.id })
              }
            >
              <Image
                source={{
                  uri: item.profile_path
                    ? `https://image.tmdb.org/t/p/w185${item.profile_path}`
                    : 'https://via.placeholder.com/80x80?text=N/A',
                }}
                style={styles.actorImg}
              />
              <Text
                style={[
                  styles.actorName,
                  { color: darkMode ? '#fff' : '#000' },
                ]}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backBtn: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 8,
    borderRadius: 20,
  },
  image: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  content: { padding: 15 },
  rowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 10,
  },
  meta: {
    fontSize: 14,
    marginBottom: 2,
  },
  overview: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 20,
  },
  castTitle: {
    fontSize: 18,
    marginTop: 20,
    marginBottom: 10,
  },
  actorCard: {
    alignItems: 'center',
    marginRight: 10,
  },
  actorImg: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  actorName: {
    fontSize: 12,
    marginTop: 6,
    textAlign: 'center',
  },
});
