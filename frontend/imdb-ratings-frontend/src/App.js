import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';

import Upload from './pages/Upload';
import Compare from './pages/Compare';
import YearWatch from './pages/YearWatch';
import Statistics from './pages/Statistics';
import AllData from './pages/AllData';
import WorldMap from './pages/WorldMap';

function App() {
  return (
    <Router>
      <div>
        <nav
          style={{
            width: '100%',
            height: '60px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#f5f5f5',
            gap: '1rem',
          }}
        >
          <Link to="/upload">Upload File</Link> | 
          <Link to="/compare">Compare Dates</Link> | 
          <Link to="/year">Year Watch</Link> | 
          <Link to="/rating-statistics">Statistics</Link> |
          <Link to="/all-data">All Data</Link> |
          <Link to="/world-map">World Map</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Navigate to="/upload" />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/year" element={<YearWatch />} />
          <Route path="/rating-statistics" element={<Statistics />} />
          <Route path="/all-data" element={<AllData />} />
          <Route path="/world-map" element={<WorldMap />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
