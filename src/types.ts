export interface Movie {
  id: string;
  title: string;
  type: string; // genre: e.g. "Sci-Fi", "Action", "Drama", "Crime"
  contentType: 'movie' | 'series';
  year: number;
  runtime: string;
  rating: number; // e.g. 8.9
  img: string; // poster URL
  backdropUrl: string; // banner URL
  videoUrl: string; // mock/real streaming link or interactive trailer preview
  description: string;
  interpreter: string; // e.g. "NEW", "TRENDING", "CLASSIC", "POPULAR"
  director: string;
  cast: string[];
}

export interface UserComment {
  id: string;
  movieId: string;
  userName: string;
  text: string;
  rating: number;
  timestamp: string;
}

export interface WatchlistItem {
  id: string;
  movieId: string;
  addedAt: string;
}
