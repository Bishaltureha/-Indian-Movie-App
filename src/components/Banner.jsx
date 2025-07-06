// /src/components/Banner.jsx
import React from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

const Banner = ({ movie }) => {
  const navigation = useNavigation();

  if (!movie?.backdrop_path) return null;

  const handlePress = () => {
    navigation.navigate('MovieDetails', { movie });
  };

  const posterUrl = movie?.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : 'https://via.placeholder.com/500x281.png?text=No+Image';

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
      <ImageBackground
        source={{ uri: posterUrl }}
        style={styles.banner}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.9)']}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.infoContainer}>
          <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
            {movie?.title || movie?.name}
          </Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  banner: {
    height: 250,
    justifyContent: 'flex-end',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 15,
  },
  infoContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
});

export default Banner;
