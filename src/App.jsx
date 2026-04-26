import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import StreamList from './pages/StreamList.jsx';
import Movies from './pages/Movies.jsx';
import Cart from './pages/Cart.jsx';
import About from './pages/About.jsx';

function App() {
  return (
    <div className="app-shell">
      <Navbar />

      <main className="page-shell">
        <Routes>
          <Route path="/" element={<StreamList />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
