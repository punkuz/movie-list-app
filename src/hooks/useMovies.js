import { useState, useEffect } from "react";

const API_KEY = "b793bcba";

export function useMovies(query, callback) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    callback?.();
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

  return { movies, isLoading, error };
}
