export default function NavBar({ children }) {
  return (
    <nav className='nav-bar'>
      <div className='logo'>
        <span role='img'>🎬</span>
        <h1>Movies List</h1>
      </div>
      {children}
    </nav>
  );
}
