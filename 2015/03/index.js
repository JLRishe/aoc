const { __, compose, curry, map, prop, applySpec, T, identity, converge, keys, length } = require('ramda');
const { arrayFilter, probe } = require('../shared');

// Grid is { String: Boolean }
// Point is { x: Number, y: Number }

// Number -> Number -> Point
var point = (x, y) => ({ x: x, y: y });

var deltas = {
    '^': point(0,  1),
    'v': point(0, -1),
    '<': point(-1, 0),
    '>': point(1,  0)
};

// Grid -> Point -> Point
var markStop = (grid, point) => { grid[point.x + 'x' + point.y] = true; return point; }

// Point -> Point -> Point
var advance = (start, step) => point(start.x + step.x, start.y + step.y);

// Grid -> Point -> Point -> Point
var takeStep = (grid, start, next) => markStop(grid, advance(start, next));

// Grid -> [Point] -> Point
var walkPath = 
    (grid, steps) => 
        steps.reduce((last, next) => takeStep(grid, last, next), point(0, 0));

// [[Point]] -> Number
const walkPaths = (paths) => {
    var grid = { '0x0': true };
    
    paths.forEach(p => walkPath(grid, p));
    
    return length(keys(grid));
};

const toDelta = prop(__, deltas);

// [(* -> Number -> Boolean)] -> [String] -> [Point]
const buildPaths = curry((stepFilters, steps) => compose(
    applySpec(map(arrayFilter, stepFilters)),
    map(toDelta)
)(steps));

// * -> Number -> Boolean
const santaSteps = (_, i) => i % 2 === 0;
const robotSteps = (_, i) => i % 2 === 1;

// [(* -> Number -> Boolean)] -> [String] -> Number
const walkStepTypes = stepFilters => compose(
    walkPaths,
    buildPaths(stepFilters)
);

const p1 = walkStepTypes([T]);

const p2 = walkStepTypes([santaSteps, robotSteps]);

module.exports = {
    solution: {
        ps: [p1, p2]
    }
};