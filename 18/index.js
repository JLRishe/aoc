const { compose, curry, map, sum, either } = require('ramda');
const { genHead, genDrop, genTransform } = require('func-generators');

// LightGrid is [[Boolean]]
// Switcher is ((LightGrid, Number, Number, Boolean) => Boolean)

// Number -> [*] -> Boolean
const isOuterBound = (val, arr) => val === 0 || val === arr.length - 1;
// Number -> [*] -> Boolean
const isPastBounds = (val, arr) => val < 0 || val >= arr.length;

// LightGrid => Number -> Number -> Boolean
const lightAt = (lights, r, c) => isPastBounds(r, lights) || isPastBounds(c, lights)
    ? false
    : lights[r][c];

// LightGrid -> Number -> Number -> Number
const countNeighbors = (lights, r, c) =>
    lightAt(lights, r-1, c-1) + 
    lightAt(lights, r-1, c  ) + 
    lightAt(lights, r-1, c+1) + 
    lightAt(lights, r  , c-1) + 
    lightAt(lights, r  , c+1) + 
    lightAt(lights, r+1, c-1) + 
    lightAt(lights, r+1, c  ) + 
    lightAt(lights, r+1, c+1);


// Switcher -> LightGrid -> LightGrid
const iterate = curry((switcher, lights) => lights.map(
    (row, r) => row.map((light, c) => switcher(lights, r, c, light))
));

// Switcher
const simpleSwitcher = (lights, r, c, light) => {
    const neighbors = countNeighbors(lights, r, c);
    
    return neighbors === 3 || (light && neighbors === 2);
};

// Switcher
const fixedCornersSwitcher = (lights, r, c) => 
    isOuterBound(r, lights) && isOuterBound(c, lights);

// Switcher
const brokenSwitcher = either(fixedCornersSwitcher, simpleSwitcher);

// Switcher
const passSwitcher = (lights, r, c, light) => light;

// LightGrid -> Number
const countLights = compose(sum, map(sum));

// Number -> Switcher -> LightGrid -> LightGrid
const adjustLights = curry((times, switcher, lights) => compose(
   genHead,
   genDrop(times),
   genTransform(
       iterate(switcher)
   )
)(lights));

// LightGrid -> Number
const p1 = compose(
    countLights,
    adjustLights(100, simpleSwitcher)
);

// LightGrid -> Number
const p2 =compose(
    countLights,
    adjustLights(100, brokenSwitcher),
    iterate(either(fixedCornersSwitcher, passSwitcher))
);
        
module.exports = {
    solution: {
        ps: [p1, p2],
        type: 'lines',
        pre: map(c => c === '#')
    }
};