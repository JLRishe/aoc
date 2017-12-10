var util = require('../shared/util');
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

var adjustLights = 
    (instructions, lightController) =>
        _.sum(
            instructions.reduce(
                (ls, ins) => lightController(ins, ls), 
                createLights(1000, 1000)
            ),
            _.sum
        );

module.exports = (lines) => {
    var instructions = lines.map(parseInstruction);

    var firstController = lightController(() => 1, () => 0, val => val ? 0 : 1);
    
    var secondController = lightController(val => val + 1, val => Math.max(0, val - 1), val => val + 2);
    
    return [
        adjustLights(instructions, firstController),
        adjustLights(instructions, secondController)
    ];
};