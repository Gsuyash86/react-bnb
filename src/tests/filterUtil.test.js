import { filterProperties } from '../lib/filterUtil';

// sample properties for testing Super Host filter:
const NON_SUPER_HOST_PROPERTIES = [
  {
    hostId: 1,
    stars: 3,
  },
  {
    hostId: 1,
    stars: 3,
  },
  {
    hostId: 1,
    stars: 5,
  },
  {
    hostId: 2,
    stars: 3.9,
  },
];

const SUPER_HOST_PROPERTIES = [
  {
    hostId: 3,
    stars: 5,
  },
  {
    hostId: 4,
    stars: 5,
  },
  {
    hostId: 4,
    stars: 4,
  },
  {
    hostId: 4,
    stars: 3,
  },
];

const PROPERTIES = NON_SUPER_HOST_PROPERTIES.concat(SUPER_HOST_PROPERTIES);

const FILTERS_ALL_OFF = {
  houseTypeFilter: [],
  locationFilter: null,
  placeTypeFilter: [],
  rateFilter: [0, 2000],
  starsFilter: [0, 5],
  superHostFilter: false,
};

const FILTERS_SUPER_HOST_ON = {
  houseTypeFilter: [],
  locationFilter: null,
  placeTypeFilter: [],
  rateFilter: [0, 2000],
  starsFilter: [0, 5],
  superHostFilter: true,
};

describe('filterUtil - filterProperties()', () => {
  it('Does not remove properties when all filters are off', () => {
    expect(filterProperties(PROPERTIES, FILTERS_ALL_OFF)).toEqual(PROPERTIES);
    expect(filterProperties([], FILTERS_ALL_OFF)).toEqual([]);
  });

  it('Only keeps Super Hosts when Super Host filter is turned on', () => {
    expect(filterProperties(PROPERTIES, FILTERS_SUPER_HOST_ON)).toEqual(SUPER_HOST_PROPERTIES);
  });
});
