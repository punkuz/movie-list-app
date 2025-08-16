import WatchedMovie from "./WatchedMovie";

export default function WatchedMoviesList({ watched, onRemoveWatched }) {
  return (
    <ul className='list'>
      {watched.map((movie) => (
        <WatchedMovie
          key={movie.imdbID}
          movie={movie}
          onRemoveWatched={onRemoveWatched}
        />
      ))}
    </ul>
  );
}
