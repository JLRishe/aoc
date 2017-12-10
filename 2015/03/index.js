const { __, compose, map, prop, applySpec, T, identity } = require('ramda');
var _ = require('lodash');
const { arrayFilter, probe } = require('../shared');

var point = (x, y) => ({ x: x, y: y });

var deltas = {
    '^': point(0,  1),
    'v': point(0, -1),
    '<': point(-1, 0),
    '>': point(1,  0)
};

var markStop = (grid, point) => { grid[point.x + 'x' + point.y] = true; return point; }

var advance = (start, step) => point(start.x + step.x, start.y + step.y);

var takeStep = (grid, start, next) => markStop(grid, advance(start, next));

var walkPath = 
    (grid, steps) => 
        steps.reduce((last, next) => takeStep(grid, last, next), point(0, 0));

function walkPaths(paths) {
    var grid = { '0x0': true };
    
    paths.forEach(p => walkPath(grid, p));
    
    return _.size(grid);
}    

const toDelta = prop(__, deltas);

const santaSteps = (_, i) => i % 2 === 0;
const robotSteps = (_, i) => i % 2 === 1;

const walkStepTypes = stepFilters => compose(
    walkPaths,
    applySpec(map(arrayFilter, stepFilters)),
    map(toDelta)
);

const p1 = walkStepTypes([T]);

const p2 = walkStepTypes([santaSteps, robotSteps]);

module.exports = {
    ps: [p1, p2]
};