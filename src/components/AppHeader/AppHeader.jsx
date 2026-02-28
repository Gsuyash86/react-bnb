import * as PropTypes from 'prop-types';
import './AppHeader.scss';
import Logo from '../../assets/logo.svg?react';
import { Link, useNavigate } from 'react-router-dom';
import React, { useRef, useState } from 'react';
import Select from 'react-select';

/**
 * Get the node in `propertyLookupTree` that corresponds to `searchText`
 * @param {object} propertyLookupTree - A tree containing each property grouped by the letters in it's name.
 * @param {string} searchText - Text to look for in `propertyLookupTree`
 * @returns {object | undefined} The node in propertyLookupTree that corresponds to `searchText` or undefined if no
 * corresponding node can be found.
 */
function goToNode(propertyLookupTree, searchText) {
  let node = propertyLookupTree;
  for (let i = 0; i < searchText.length; i++) {
    const char = searchText[i];
    if (node[char]) {
      node = node[char];
    } else {
      return undefined;
    }
  }
  return node;
}

/**
 * Get an array of all of the matches in `node` and the nodes below it in the tree
 * @param {object} node - a node of the propertyLookupTree. Note: the entire tree can also be thought of as the root node.
 * @return An array of all matches under `node`
 */
function collectAllMatches(node) {
  let matches = [];
  if (node.match) {
    matches.push(node.match);
  }
  for (const key in node) {
    if (key !== 'match') {
      matches = matches.concat(collectAllMatches(node[key]));
    }
  }
  return matches;
}

/**
 * Find all properties in propertyLookupTree where the name starts with `searchText`
 * @param {object} propertyLookupTree - A tree containing each property grouped by the letters in it's name.
 * @example if there were 3 properties named "B", "Bar" and "Baz" then propertyLookupTree would be:
  {
    b: {
      match: {id: "b", name: "B"},
      a: {
        r: {
          match: {id: "bar", name: "Bar"}
        },
        z: {
          match: {id: "baz", name: "Baz"}
        }
      }
    }
  }
 * @param {string} searchText - lowercase text to be used to find matching properties
 * @return A list of match objects (with `name` and `id` properties) for properties that match `searchText`
 * @example if `searchText` is "ba" and `propertyLookupTree` is the example listed above then the return value would be:
 * [{id: "bar", name: "Bar"}, {id: "baz", name: "Baz"}]
 */
export function findMatches(propertyLookupTree, searchText) {
  let node = goToNode(propertyLookupTree, searchText);
  if (!node) {
    return [];
  }
  return collectAllMatches(node);
}

function AppHeader({ propertyLookupTree }) {
  const [searchOptions, setSearchOptions] = useState([]);
  const navigate = useNavigate();
  const searchSelectRef = useRef(null);

  function onSearchChange(searchText) {
    if (searchText.length > 0) {
      let matches = findMatches(propertyLookupTree, searchText.toLowerCase());
      let options = matches.map((match) => ({ value: match.id, label: match.name }));
      setSearchOptions(options);
    } else {
      setSearchOptions([]);
    }
  }

  function onSearchSelect(selectedItem, { action }) {
    setSearchOptions([]);
    if (action === 'select-option') {
      setTimeout(() => searchSelectRef.current.clearValue(), 0);
      navigate('/property/' + selectedItem.value);
    }
  }

  return (
    <div className="app-header">
      <Link to="/" className="logo-wrapper">
        <Logo className="logo" />
        Kbnb
      </Link>
      <Select
        className="react-select-container"
        classNamePrefix="react-select"
        options={searchOptions}
        onInputChange={onSearchChange}
        onChange={onSearchSelect}
        placeholder="Search"
        noOptionsMessage={() => 'Enter a property name...'}
        ref={searchSelectRef}
      />
    </div>
  );
}

AppHeader.propTypes = {
  propertyLookupTree: PropTypes.object,
};

export default AppHeader;
