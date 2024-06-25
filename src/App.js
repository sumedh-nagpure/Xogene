import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DrugSearch from './components/DrugSearch';
import DrugDetail from './components/DrugDetail';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/drugs/search" element={<DrugSearch />} />
          <Route path="/drugs/:drugName" element={<DrugDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
