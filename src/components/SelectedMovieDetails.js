import { useState, useEffect } from "react";
import ErrorMessage from "./ErrorMessage";
import Loader from "./Loader";

export default function SelectedMovieDetails({
  movieId,
  onCloseMovie,
  onSetWatched,
  watched,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [movieDetails, setMovieDetails] = useState({});
  const [errorMsg, setErrorMsg] = useState("");
  // Destructuring movie details for cleaner access
  const {
    Title,
    Released,
    Runtime,
    Genre,
    Director,
    Actors,
    Plot,
    Language,
    Country,
    Awards,
    Poster,
    imdbRating,
  } = movieDetails;
  const API_KEY = "b793bcba";

  // useEffect to fetch details of a specific movie
  useEffect(() => {
    const fetchMovieDetails = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://www.omdbapi.com/?i=${movieId}&apikey=${API_KEY}`
        );
        const data = await response.json();
        if (data.Error) {
          throw new Error(data.Error);
        }
        // Do something with the movie details
        setMovieDetails(data);
        // Clear any previous errors
        setErrorMsg("");
      } catch (error) {
        setErrorMsg(error.message);
        console.error("Error fetching movie details:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMovieDetails();
  }, [movieId]); // Dependency array to re-run effect when movieId changes

  //set title directly based on movie title using useEffect
  useEffect(() => {
    if (movieDetails.Title) {
      document.title = `${movieDetails.Title}`;
    }
    //cleanup
    return () => {
      document.title = "Movies List App";
    };
  }, [movieDetails.Title]);

  const isMovieWatched = watched.find((movie) => movie.imdbID === movieId);

  // Function to handle adding the movie to the watched list
  function handleSetWatched() {
    //filter if the movie is already added
    if (!isMovieWatched) {
      const movie = { ...movieDetails, userRating: 0 };
      onSetWatched((prev) => [...prev, movie]);
      onCloseMovie();
    }
  }

  // add to close movie when escape is pressed
    useEffect(() => {
      function cb(e) {
        if (e.key === "Escape") {
          onCloseMovie();
        }
      }
      document.addEventListener("keydown", cb);
      //cleanup
      return () => {
        document.removeEventListener("keydown", cb);
      };
    }, [onCloseMovie]);

  return (
    <div className='details'>
      {isLoading && <Loader />}
      {errorMsg && <ErrorMessage message={errorMsg} />}
      {!isLoading && !errorMsg && (
        <>
          <header>
            <button className='btn-back' onClick={onCloseMovie}>
              ❌
            </button>
            <img src={Poster} alt={`${Title} poster`} />
            <div className='details-overview'>
              <h2>{Title}</h2>
              <p>
                {Released} &bull; {Runtime}
              </p>
              <p>{Genre}</p>
              <p>
                <span>⭐️</span>
                {imdbRating} IMDb rating
              </p>
            </div>
          </header>
          <section>
            <div className='rating'>
              {!isMovieWatched ? (
                <button onClick={handleSetWatched} className='btn-add'>
                  + Add to List
                </button>
              ) : (
                "You already added this movie to your watched list."
              )}
            </div>
            <p>Country of Origin: {Country}</p>
            <p>Language: {Language}</p>
            <p>Awards: {Awards}</p>
            <p>
              <em>{Plot}</em>
            </p>
            <p>Starring {Actors}</p>
            <p>Directed By {Director}</p>
          </section>
        </>
      )}
    </div>
  );
}
