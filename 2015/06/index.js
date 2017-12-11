const { compose, map, curry, sum, reduce } = require('ramda');
var util = require('../shared/util');
const { probe, add1 } = require('../shared');
var _ = require('lodash');

var createLights = 
    (width, height) => 
        _.range(height).map(() => _.range(0, width, 0)); 

var point = (x, y) => ({ x: Number(x), y: Number(y) });

function parseInstruction(line) {
    var parts = /^(.+) (\d+),(\d+) through (\d+),(\d+)$/.exec(line);

    return {
        action: parts[1],
        start: point(parts[2], parts[3]),
        end: point(parts[4], parts[5])
    };
}

var repeat = util.repeat;

var between = (v1, v2, val) => val >= Math.min(v1, v2) && val <= Math.max(v1, v2);

function lightController(turnOnAction, turnOffAction, toggleAction) {
    var actionMap = { 
        'turn on': turnOnAction, 
        'turn off': turnOffAction, 
        'toggle': toggleAction 
    };
    
    var process = 
        (lights, action, start, end) =>
            lights.map((row, r) => (r < start.y || r > end.y)
                ? row
                : row.map((light, c) => (c < start.x || c > end.x)
                    ? light
                    : action(light)
                  )
            );
            
    return (instruction, lights) => 
        process(lights, actionMap[instruction.action], instruction.start, instruction.end);
}

var adjustLights = curry((controller, instructions) => compose(
    sum,
    map(sum),
    reduce(
        (ls, ins) => controller(ins, ls), 
        createLights(1000, 1000)
    )
)(instructions));
        
const adjust = (turnOn, turnOff, toggle) => compose(
    adjustLights(lightController(turnOn, turnOff, toggle)),
    map(parseInstruction)
);

const p1 = adjust(
    () => 1, 
    () => 0, 
    val => val ? 0 : 1
);

const p2 = adjust(
    add1, 
    val => Math.max(0, val - 1), 
    compose(add1, add1)
);


module.exports = {
    solution: {
        type: 'lines',
        ps: [p1, p2]
    }
}