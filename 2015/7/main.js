var util = require('../shared/util');
var parseWire = require('./parseWire');

function wireSource(wires) {
    var wireMap = {},
        wireValues = {};
        
    function wireValue(name) {
        if (!(name in wireValues)) {
            wireValues[name] = wireMap[name].compute(wireValue);
        }
        return wireValues[name];
    }
    
    wires.forEach(w => wireMap[w.name] = w);
    
    return {
        wireValue: wireValue
    };
}

module.exports = lines => {
    var wires = lines.map(parseWire);

    var ws1 = wireSource(wires);
    var aValue = ws1.wireValue('a');
    
    var newWires = wires.map(wire => 
        wire.name === 'b' 
            ? { name: 'b', compute: () => aValue } 
            : wire
    );

    return [aValue, wireSource(newWires).wireValue('a')];
};