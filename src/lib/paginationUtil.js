// Maximum number of properties to show on a page
export const PROPERTIES_PER_PAGE = 6;

/**
 * Gets the Array of page numbers to shown in the pagination component. The first and last page should always be shown
 * and curPage should be centered among the remaining pages if possible.
 * @param {Number}  totalPages - The total number of pages
 * @param {Number} curPage - The page number that is currently selected. This is 1 indexed so the first page would be 1
 * @param {Number} maxLabels - The maximum number of page numbers to show in the pagination component
 * @return {Array} - Array of page numbers to show in the pagination component.
 * @example getPaginationLabels(100, 50, 5) //returns [1, 49, 50, 51, 100]
 */
export const getPaginationLabels = (totalPages, curPage, maxLabels) => {
  if (totalPages <= 0) return [];
  if (totalPages <= maxLabels) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const numberOfMiddlePages = maxLabels - 2;
  let idealStart = curPage - Math.floor((numberOfMiddlePages - 1) / 2);
  let idealEnd = curPage + Math.ceil((numberOfMiddlePages - 1) / 2);

  if (idealStart <= 1) {
    idealStart = 2;
    idealEnd = idealStart + numberOfMiddlePages - 1;
  }

  if (idealEnd >= totalPages) {
    idealEnd = totalPages - 1;
    idealStart = idealEnd - numberOfMiddlePages + 1;
    if (idealStart <= 1) {
      idealStart = 2;
    }
  }

  const labels = [1];
  for (let i = idealStart; i <= idealEnd; i++) {
    labels.push(i);
  }
  labels.push(totalPages);

  return labels;
};

/**
 * Get the properties to show for the specified page from the full list of properties
 * @param {Array}  properties - Array containing all properties
 * @param {Number} page - The current paginated page the UI should display
 * @return {Array} - The properties for the specified page
 */
export const getPropertiesForPage = (properties, page) => {
  const firstPropertyIndex = PROPERTIES_PER_PAGE * (page - 1);
  const lastPropertyIndex = PROPERTIES_PER_PAGE * page;
  return properties.slice(firstPropertyIndex, lastPropertyIndex);
};
