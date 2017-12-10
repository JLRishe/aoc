var _ = require('lodash');

// parses a single present. a present is represented as an array of 3 integers, one for each dimension
var parsePresent = line => line.split('x').map(Number);

var permutations = [[0, 1], [1, 2], [2, 0]];
// applies an operation to each of the three possible pairs of three values, 
// and returns an array of the three results
// e.g. permute3([1, 2, 3], (l, r) => l + r) will return [1 + 2, 2 + 3, 3 + 1] === [3, 5, 4]
var permute3 = (values, f) => permutations.map(p => f(values[p[0]], values[p[1]]));

var paperFromSides = sides => _.sum(sides.map(s => s * 2)) + _.min(sides);
var paper = present => paperFromSides(permute3(present, (l, r) => l * r));

var wrapRibbon = present => _.min(permute3(present, (l, r) => 2 * (l + r)));
var bowRibbon = present => present.reduce((l, n) => l * n);
var ribbon = present => wrapRibbon(present) + bowRibbon(present);

module.exports = (lines) => {
    var presents = lines.map(parsePresent);

    return [_.sum(presents, paper), _.sum(presents, ribbon)];
};