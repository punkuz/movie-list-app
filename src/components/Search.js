import { useEffect, useRef } from "react";

export default function Search({ query, setQuery }) {
  const inputEl = useRef(null);
  useEffect(() => {
    function cb(e) {
      if (document.activeElement === inputEl.current) return;
      if (e.key === "Enter") {
        inputEl.current.focus();
        setQuery("");
      }
    }
    document.addEventListener("keydown", cb);
    return () => {
      document.removeEventListener("keydown", cb);
    };
  }, [setQuery]);
  return (
    <input
      className='search'
      type='text'
      placeholder='Search movies...'
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEl}
    />
  );
}
