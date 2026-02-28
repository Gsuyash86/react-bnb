import PropertyGrid from '../../components/PropertyGrid/PropertyGrid';
import PropertyFilters from '../../components/PropertyFilters/PropertyFilters';
import './Home.scss';
import { DEFAULT_FILTERS } from '../../lib/filterUtil';
import { useState } from 'react';

const Home = () => {

  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  return (
    <div className="home-page">
      <div className="home-filters">
        <PropertyFilters filters={filters} setFilters={setFilters} />
      </div>
      <div className="home-content">
        <PropertyGrid filters={filters} />
      </div>
    </div>
  );
};

export default Home;
