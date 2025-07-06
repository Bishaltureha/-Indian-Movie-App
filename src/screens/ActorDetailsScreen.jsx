import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';

const API_KEY = 'c856834ab20ef843559b338e1eb3db43';
const IMAGE_URL = 'https://image.tmdb.org/t/p/w185';

const ActorDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { actorId } = route.params;
  const [actor, setActor] = useState(null);
  const [knownFor, setKnownFor] = useState([]);
  const { darkMode } = useTheme();

  useEffect(() => {
    const fetchActorDetails = async () => {
      try {
        const [actorRes, creditRes] = await Promise.all([
          fetch(
            `https://api.themoviedb.org/3/person/${actorId}?api_key=${API_KEY}`,
          ),
          fetch(
            `https://api.themoviedb.org/3/person/${actorId}/combined_credits?api_key=${API_KEY}`,
          ),
        ]);

        const actorData = await actorRes.json();
        const creditData = await creditRes.json();

        setActor(actorData);
        setKnownFor(creditData.cast || []);
      } catch (err) {
        console.error('Actor details error:', err);
      }
    };

    fetchActorDetails();
  }, [actorId]);

  if (!actor) return null;

  const themeStyle = {
    backgroundColor: darkMode ? '#000' : '#fff',
    textColor: darkMode ? '#fff' : '#000',
    subTextColor: darkMode ? '#ccc' : '#555',
    cardBg: darkMode ? '#111' : '#eee',
  };

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: themeStyle.backgroundColor },
      ]}
    >
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color={themeStyle.textColor} />
      </TouchableOpacity>

      <Image
        source={{
          uri: actor.profile_path
            ? `${IMAGE_URL}${actor.profile_path}`
            : 'https://via.placeholder.com/200x300?text=No+Image',
        }}
        style={styles.profile}
      />

      <Text style={[styles.name, { color: themeStyle.textColor }]}>
        {actor.name}
      </Text>

      {actor.place_of_birth && (
        <Text style={[styles.meta, { color: themeStyle.subTextColor }]}>
          📍 {actor.place_of_birth}
        </Text>
      )}

      {actor.birthday && (
        <Text style={[styles.meta, { color: themeStyle.subTextColor }]}>
          🎂 {actor.birthday}
        </Text>
      )}

      <Text style={[styles.bio, { color: themeStyle.subTextColor }]}>
        {actor.biography || 'No biography available.'}
      </Text>

      <Text style={[styles.sectionTitle, { color: themeStyle.textColor }]}>
        Known For
      </Text>

      <FlatList
        horizontal
        data={knownFor.slice(0, 10)}
        keyExtractor={(item, index) =>
          item?.id?.toString?.() || index.toString()
        }
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.movieCard, { backgroundColor: themeStyle.cardBg }]}
            onPress={() => navigation.navigate('MovieDetails', { movie: item })}
          >
            <Image
              source={{
                uri: item.poster_path
                  ? `${IMAGE_URL}${item.poster_path}`
                  : 'https://via.placeholder.com/100x150?text=No+Image',
              }}
              style={styles.movieImage}
            />
            <Text
              style={[styles.movieTitle, { color: themeStyle.textColor }]}
              numberOfLines={2}
            >
              {item.title || item.name}
            </Text>
          </TouchableOpacity>
        )}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 15,
    zIndex: 10,
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  profile: {
    width: 160,
    height: 160,
    borderRadius: 80,
    alignSelf: 'center',
    marginTop: 60,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  meta: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 2,
  },
  bio: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
    marginTop: 10,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft: 10,
  },
  movieCard: {
    width: 100,
    marginHorizontal: 8,
    alignItems: 'center',
    borderRadius: 8,
    padding: 4,
  },
  movieImage: {
    width: 100,
    height: 150,
    borderRadius: 8,
    marginBottom: 6,
  },
  movieTitle: {
    fontSize: 12,
    textAlign: 'center',
  },
});

export default ActorDetailsScreen;
