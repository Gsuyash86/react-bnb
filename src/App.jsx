import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.scss';

import Home from './pages/Home/Home';
import Property from './pages/Property/Property';
import AppHeader from './components/AppHeader/AppHeader';
import { ApiUtil } from './lib/apiUtil';

const App = () => {
  const [propertyLookupTree, setPropertyLookupTree] = useState();

  useEffect(() => {
    ApiUtil.getLookupTree().then((lookupTree) => {
      setPropertyLookupTree(lookupTree);
    });
  }, []);

  return (
    <Router>
      <div className="app">
        <AppHeader propertyLookupTree={propertyLookupTree} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/property/:propertyId" element={<Property />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
