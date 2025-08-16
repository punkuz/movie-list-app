import Movie from "./Movie";

export default function MoviesList({ movies, onSelectedMovie }) {
  return (
    <ul className='list list-movies'>
      {movies?.map((movie) => (
        <Movie key={movie.imdbID} movie={movie} onSelectedMovie={onSelectedMovie} />
      ))}
    </ul>
  );
}
