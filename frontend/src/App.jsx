import { Suspense, lazy } from 'react';
import { Routes, Route, Link, Navigate } from 'react-router';

const Upload = lazy(() => import('./pages/Upload'));
const Compare = lazy(() => import('./pages/Compare'));
const YearWatch = lazy(() => import('./pages/YearWatch'));
const Statistics = lazy(() => import('./pages/Statistics'));
const AllData = lazy(() => import('./pages/AllData'));
const WorldMap = lazy(() => import('./pages/WorldMap'));

function App() {
  return (
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

      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Navigate to="/upload" />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/year" element={<YearWatch />} />
          <Route path="/rating-statistics" element={<Statistics />} />
          <Route path="/all-data" element={<AllData />} />
          <Route path="/world-map" element={<WorldMap />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
