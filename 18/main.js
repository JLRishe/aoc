var util = require('../shared/util');
var _ = require('lodash');

function lightAt(lights, r, c) {
    return r < 0 || r >= lights.length || c < 0 || c >= lights.length
        ? 0
        : lights[r][c];
}

function countNeighbors(lights, r, c) {
    return lightAt(lights, r-1,c-1) + 
    lightAt(lights, r-1,c) + 
    lightAt(lights, r-1,c+1) + 
    lightAt(lights, r,c-1) + 
    lightAt(lights, r,c+1) + 
    lightAt(lights, r+1,c-1) + 
    lightAt(lights, r+1,c) + 
    lightAt(lights, r+1,c+1);
}

function iterate(lights, switcher) {
    return lights.map((row, r) => 
        row.map((light, c) => switcher(lights, light, countNeighbors(lights, r, c), r, c))
    );            
}

function printLights(lights) {
    lights.forEach(r => console.log(r.join('')));
    console.log();
}

var simpleSwitcher = 
    (lights, light, neighbors, r, c) => neighbors === 3 || (light && neighbors === 2);

var fixedCornersSwitcher = 
    (lights, light, neighbors, r, c) => 
        (r === 0 || r === lights.length - 1) && 
        (c === 0 || c === lights.length - 1);

var brokenSwitcher =
    (lights, light, neighbors, r, c) => 
        fixedCornersSwitcher(lights, light, neighbors, r, c) ||
        simpleSwitcher(lights, light, neighbors, r, c);

var adjustLights = 
    (lights, times, switcher) =>
        _.sum(util.applyN(lights, ls => iterate(ls, switcher), times), row => _.sum(row));

module.exports = (lines) => {
    var lights = lines.map(l => _.map(l, c => c === '#' ? 1 : 0));
    
    var first = adjustLights(lights, 100, simpleSwitcher);
    
    var newLights = iterate(lights, (lights, light, neighbors, r, c) => fixedCornersSwitcher(lights, light, neighbors, r, c) || light);
    
    var second = adjustLights(newLights, 100, brokenSwitcher);
    
    return [first, second];
};