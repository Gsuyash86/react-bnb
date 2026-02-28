const fs = require('fs');
const properties = require('./data/properties.json');

function buildLookupTree(properties) {
  let tree = {};

  properties.forEach((property) => {
    let name = property.name;
    let charIndex = 0;

    let curNode = tree;

    while (charIndex < name.length) {
      let char = name[charIndex].toLowerCase();
      if (char in curNode) {
        curNode = curNode[char];
      } else {
        curNode[char] = {};
        curNode = curNode[char];
      }
      charIndex++;
    }
    curNode.match = { name, id: property.id };
  });

  return tree;
}

// let mockProperties = [
//   { name: 'aaa' },
//   { name: 'aba' },
//   { name: 'abb' },
//   { name: 'cat' },
//   { name: 'ca' },
// ];

let tree = buildLookupTree(properties);

fs.writeFileSync('./data/lookupTree.json', JSON.stringify(tree));
