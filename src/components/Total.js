export default function Total({ movies }) {
  return (
    <p className='num-results'>
      {movies.length > 0 ? (
        <>
          Found <strong>{movies.length}</strong> results
        </>
      ) : (
        <>No results found</>
      )}
    </p>
  );
}
