const API_KEY = 'c856834ab20ef843559b338e1eb3db43';
const BASE_URL = 'https://api.themoviedb.org/3';

export const fetchMovies = async (endpoint, params = '') => {
  try {
    const joinChar = endpoint.includes('?') ? '&' : '?';
    const res = await fetch(`${BASE_URL}${endpoint}${joinChar}api_key=${API_KEY}${params}`);
   
    // const res = await fetch(`${BASE_URL}${endpoint}&api_key=${API_KEY}${params}`);
    const json = await res.json();
    return json.results || [];
  } catch (e) {
    console.error('API error:', e)
    return [];
  }
};

export const endpoints = {
  trending: `/trending/movie/week`,
  topRated: `/movie/top_rated`,
  newMovies: `/movie/now_playing`,
  newSeries: `/tv/on_the_air`,
  trendingSeries: `/trending/tv/week`,
};




// export const endpoints = {
//   trending: `/discover/movie?with_origin_country=IN&sort_by=popularity.desc`,
//   topRated: `/discover/movie?with_origin_country=IN&sort_by=vote_average.desc`,
//   newMovies: `/discover/movie?with_origin_country=IN&sort_by=release_date.desc`,
//   newSeries: `/discover/tv?with_origin_country=IN&sort_by=first_air_date.desc`,
//   trendingSeries: `/discover/tv?with_origin_country=IN&sort_by=popularity.desc`,
// };
