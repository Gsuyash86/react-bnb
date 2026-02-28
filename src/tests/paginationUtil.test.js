import { getPaginationLabels } from '../lib/paginationUtil';

describe('paginationUtil - getPaginationLabels()', () => {
  it('Returns page labels when there is a gap on both sides of the current page', () => {
    // curPage in the middle with ellipse on either side
    expect(getPaginationLabels(9, 5, 7)).toEqual([1, 3, 4, 5, 6, 7, 9]);
    expect(getPaginationLabels(42, 10, 5)).toEqual([1, 9, 10, 11, 42]);
    expect(getPaginationLabels(100, 98, 3)).toEqual([1, 98, 100]);
  });

  it('Returns page labels when there is a gap only on the right side of the current page', () => {
    expect(getPaginationLabels(10, 1, 7)).toEqual([1, 2, 3, 4, 5, 6, 10]);
    expect(getPaginationLabels(50, 2, 5)).toEqual([1, 2, 3, 4, 50]);
    expect(getPaginationLabels(100, 3, 5)).toEqual([1, 2, 3, 4, 100]);
  });

  it('Returns page labels when there is a gap only on the left side of the current page', () => {
    expect(getPaginationLabels(10, 10, 7)).toEqual([1, 5, 6, 7, 8, 9, 10]);
    expect(getPaginationLabels(50, 49, 5)).toEqual([1, 47, 48, 49, 50]);
    expect(getPaginationLabels(100, 98, 5)).toEqual([1, 97, 98, 99, 100]);
  });

  it('Returns page labels when there are no gaps', () => {
    expect(getPaginationLabels(0, 0, 7)).toEqual([]);
    expect(getPaginationLabels(5, 1, 5)).toEqual([1, 2, 3, 4, 5]);
    expect(getPaginationLabels(4, 3, 9)).toEqual([1, 2, 3, 4]);
  });
});
