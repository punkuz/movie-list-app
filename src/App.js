import { useState } from "react";
import NavBar from "./components/NavBar";
import Loader from "./components/Loader";
import Total from "./components/Total";
import Search from "./components/Search";
import Box from "./components/Box";
import MoviesList from "./components/MoviesList";
import WatchedSummary from "./components/WatchedSummary";
import WatchedMoviesList from "./components/WatchedMoviesList";
import ErrorMessage from "./components/ErrorMessage";
import Main from "./components/Main";
import SelectedMovieDetails from "./components/SelectedMovieDetails";
import { useMovies } from "./hooks/useMovies";
import { useLocalStorage } from "./hooks/useLocalStorage";

// Helper function to calculate the average of an array
export const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function App() {
  const [query, setQuery] = useState("breaking");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [watched, setWatched] = useLocalStorage([], "watchedMovies");

  // 📝 Use the custom hook to handle all movie fetching logic
  const { movies, isLoading, error } = useMovies(query, handleCloseMovie);

  // Function to handle movie selection
  const handleSelectedMovie = (imdbID) => {
    // If the same movie is clicked again, we close the details panel
    setSelectedMovie((prevId) => (prevId === imdbID ? null : imdbID));
  };
  // Function to close the movie details panel
  function handleCloseMovie() {
    setSelectedMovie(null);
  }

  // 📝 New function: handles removing a movie from the watched list
  const handleRemoveWatched = (imdbID) => {
    setWatched((prevWatched) =>
      // Filter out the movie with the matching imdbID
      prevWatched.filter((movie) => movie.imdbID !== imdbID)
    );
  };

  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <Total movies={movies} />
      </NavBar>
      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MoviesList
              movies={movies}
              onSelectedMovie={handleSelectedMovie}
              onCloseMovie={handleCloseMovie}
            />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {/* Conditional rendering: show details if a movie is selected, otherwise show the watched list */}
          {selectedMovie ? (
            <SelectedMovieDetails
              movieId={selectedMovie}
              onCloseMovie={handleCloseMovie}
              onSetWatched={setWatched}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />{" "}
              <WatchedMoviesList
                watched={watched}
                onRemoveWatched={handleRemoveWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
