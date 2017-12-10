var _ = require('lodash');

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

function solve(content) {
    var steps = _.map(content, s => deltas[s]);
    
    var santaSteps = steps.filter((_, i) => i % 2 === 0),
        robotSteps = steps.filter((_, i) => i % 2 === 1);
        
    return [
        walkPaths([steps]),
        walkPaths([santaSteps, robotSteps])
    ];
}

module.exports = solve;