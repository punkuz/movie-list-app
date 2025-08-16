import { useEffect, useState } from "react";
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

// Helper function to calculate the average of an array
export const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState("breaking");
  const [movies, setMovies] = useState([]);
  // const [watched, setWatched] = useState([]);
  const [error, setError] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);

  // Best Practice: Initializing state from localStorage for data persistence
  // We use a function to ensure this logic runs only once on initial render.
  const [watched, setWatched] = useState(() => {
    const storedWatched = localStorage.getItem("watchedMovies");
    return storedWatched ? JSON.parse(storedWatched) : [];
  });
  // useEffect to save the watched list to localStorage whenever it changes
  useEffect(() => {
    // We stringify the array because localStorage only stores strings
    localStorage.setItem("watchedMovies", JSON.stringify(watched));
  }, [watched]);
  //call omdb movie api with useEffect
  const API_KEY = "b793bcba";
  useEffect(() => {
    const controller = new AbortController();
    const fetchMovies = async () => {
      setError("");
      setIsLoading(true);
      try {
        const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("Something went wrong with the API request!");
        const data = await res.json();
        if (data.Response === "False") {
          throw new Error(data.Error || "Movies not found!");
        }
        setMovies(data.Search || []);
        setError("");
      } catch (err) {
        //set only if its not a abort error
        if (err.name !== "AbortError") {
          setError(err.message || "An unknown error occurred.");
          setMovies([]);
        }
      } finally {
        setIsLoading(false);
      }
    };
    if (query.length < 3) {
      setMovies([]);
      setError("Please enter at least 3 characters to search.");
      return;
    }
    fetchMovies();
    return () => {
      controller.abort(); // Cleanup the fetch request on component unmount
    };
  }, [query]);

  // Function to handle movie selection
  const handleSelectedMovie = (imdbID) => {
    // If the same movie is clicked again, we close the details panel
    setSelectedMovie((prevId) => (prevId === imdbID ? null : imdbID));
  };
  // Function to close the movie details panel
  const handleCloseMovie = () => {
    setSelectedMovie(null);
  };

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
