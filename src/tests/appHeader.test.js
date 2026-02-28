import { findMatches } from '../components/AppHeader/AppHeader';

const BAR_TREE = {
  b: {
    match: { id: 'b', name: 'B' },
    a: {
      r: {
        match: { id: 'bar', name: 'Bar' },
      },
      z: {
        match: { id: 'baz', name: 'Baz' },
      },
    },
  },
};

describe('AppHeader - findMatches()', () => {
  it('Returns empty array when the lookup tree is empty', () => {
    expect(findMatches({}, 'hello')).toEqual([]);
  });

  it('Returns empty array when there are no matches', () => {
    expect(findMatches(BAR_TREE, 'hello')).toEqual([]);
    expect(findMatches(BAR_TREE, 'barz')).toEqual([]);
    expect(findMatches(BAR_TREE, 'bab')).toEqual([]);
  });

  it('Returns exact matches', () => {
    expect(findMatches(BAR_TREE, 'b')).toContainEqual({ id: 'b', name: 'B' });
    expect(findMatches(BAR_TREE, 'bar')).toContainEqual({ id: 'bar', name: 'Bar' });
    expect(findMatches(BAR_TREE, 'baz')).toContainEqual({ id: 'baz', name: 'Baz' });
  });

  it('Returns all matches under the node that matches the search text', () => {
    expect(findMatches(BAR_TREE, 'b')).toEqual(
      expect.arrayContaining([
        { id: 'bar', name: 'Bar' },
        { id: 'baz', name: 'Baz' },
      ])
    );

    expect(findMatches(BAR_TREE, 'ba')).toEqual([
      { id: 'bar', name: 'Bar' },
      { id: 'baz', name: 'Baz' },
    ]);
  });
});
