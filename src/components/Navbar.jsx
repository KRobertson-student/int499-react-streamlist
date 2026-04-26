import { NavLink } from 'react-router-dom';

const navItems = [
  { label: 'StreamList', path: '/' },
  { label: 'Movies', path: '/movies' },
  { label: 'Cart', path: '/cart' },
  { label: 'About', path: '/about' },
];

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar__inner">
        <div className="brand">
          <h1 className="brand__title">StreamList</h1>
          <p className="brand__subtitle">React Router navigation project</p>
        </div>

        <nav className="nav-links" aria-label="Main navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                isActive ? 'nav-link nav-link--active' : 'nav-link'
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
